import {
  FormSubmissionEntryData,
  QuestionWithRelations,
  RowTransactionErrorResult,
  RowTransactionPendingResult,
  RowTransactionResult,
  RowTransactionSkippedResult,
  RowTransactionSuccessResult,
  RowTransactionUpdatedResult,
} from '@/types/api'
import { SyncStatus as SyncStatusEnum } from '@/enums/dashboard-sync'
import { DashboardService } from '@/lib/services'
import { SubmissionSyncService } from './submission.service'
import { QuestionRepository } from '@/lib/repositories'
import { QueueService } from '@/lib/services'
import { Log } from '@/lib/utils/log'
import { prisma } from '@/lib/prisma'
import { SyncJobStatus } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import { InputJsonValue } from '@prisma/client/runtime/library'
import {
  BatchProgress,
  JobResult,
  PusherBatchProgress,
  StartSyncResponse,
  SyncJobProgress,
} from '@/types/services/sync.types'
import { SocketServer } from '@/lib/socket/server'
import { transformJobData } from '@/lib/utils'
import { DashboardRepository } from '@/lib/repositories/dashboard/dashboard.repository'
import { SyncError } from '@/errors/sync.error'

export class DashboardSyncService {
  static async startSync(
    id: string,
    formData: FormSubmissionEntryData[],
  ): Promise<StartSyncResponse> {
    const dashboard = await DashboardService.getById(id)
    if (!dashboard) {
      throw new Error('Dashboard not found')
    }

    const batchId = uuidv4()

    const jobs = []

    for (const [index, row] of formData.entries()) {
      const initialResult: JobResult = {
        retryCount: 0,
        status: SyncJobStatus.PENDING,
      }

      const job = await prisma.syncJob.create({
        data: {
          dashboardId: id,
          batchId,
          rowIndex: index,
          status: SyncJobStatus.PENDING,
          data: row,
          result: initialResult as unknown as InputJsonValue,
        },
      })

      jobs.push(job)
    }

    for (const job of jobs) {
      try {
        // Publicar cada job en la cola
        await QueueService.publishSyncJob({
          jobId: job.id,
          dashboardId: id,
          data: job.data as FormSubmissionEntryData,
        })
      } catch (error) {
        Log.error('Error publishing job to QStash', { error })
        return {
          message: `Sincronizando ${jobs.length} activaciones de manera local`,
          batchId,
          totalJobs: jobs.length,
        }
      }
    }

    Log.info('Sync batch started', { batchId, totalJobs: jobs.length })
    return {
      message: `Sincronizando ${jobs.length} activaciones`,
      batchId,
      totalJobs: jobs.length,
    }
  }

  static async processJob(jobId: string): Promise<void> {
    Log.info('Starting Job process: ------------------------')
    const job = await prisma.syncJob.findUnique({
      where: { id: jobId },
    })

    if (!job) {
      throw new Error('Job not found')
    }

    if (!job.data || typeof job.data !== 'object') {
      throw new Error('Invalid job data: must be a JSON object')
    }

    // Validar que sea un objeto plano (no un array)
    if (Array.isArray(job.data)) {
      throw new Error('Invalid job data: must be a JSON object, not an array')
    }

    // Transformar los datos del job a FormSubmissionEntryData
    const formData = transformJobData(job.data)

    // Actualizar estado a procesando
    await prisma.syncJob.update({
      where: { id: jobId },
      data: { status: SyncJobStatus.PROCESSING },
    })

    try {
      Log.info('Emitting job progress to Pusher')
      // Emitir progreso inicial
      SocketServer.emitJobProgress(jobId, {
        jobId,
        dashboardId: job.dashboardId,
        status: SyncJobStatus.PROCESSING,
        retryCount: (job.result as unknown as JobResult)?.retryCount || 0,
      })
    } catch (error) {
      Log.error('Error emitting job progress to Pusher', { error })
    }

    try {
      Log.info('Starting Job saving process')
      const dashboard = await DashboardRepository.getById(job.dashboardId)
      if (!dashboard) {
        throw new Error('Dashboard not found')
      }
      // Obtener preguntas del template
      const questions = await QuestionRepository.getTemplateQuestions(
        dashboard.templateId,
      )

      // Crear mapa de preguntas
      const questionMap = new Map<string, QuestionWithRelations>(
        questions.map((q: QuestionWithRelations) => [q.name.trim(), q]),
      )

      const result = await SubmissionSyncService.processRow(
        job.dashboardId,
        formData,
        job.rowIndex,
        questions,
        questionMap,
      )

      if (result.status === SyncStatusEnum.ERROR) {
        throw new SyncError('Error processing row', result.errors, job.rowIndex)
      }

      // Actualizar estado y resultado
      const currentResult = job.result as unknown as JobResult
      const updatedResult: JobResult = {
        ...currentResult,
        status: SyncJobStatus.COMPLETED,
        data: result,
      }

      await prisma.syncJob.update({
        where: { id: jobId },
        data: {
          status: SyncJobStatus.COMPLETED,
          result: updatedResult as unknown as InputJsonValue,
        },
      })
      try {
        // Emitir progreso final
        SocketServer.emitJobProgress(jobId, {
          jobId,
          dashboardId: job.dashboardId,
          status: SyncJobStatus.COMPLETED,
          retryCount: currentResult.retryCount,
        })
      } catch (error) {
        Log.error('Error emitting job progress to Pusher', { error })
      }

      // Emitir progreso del batch
      if (job.batchId) {
        const batchProgress = await this.getBatchProgress(job.batchId)
        try {
          const pusherObject: PusherBatchProgress = {
            batchId: batchProgress.batchId,
            dashboardId: batchProgress.dashboardId,
            totalJobs: batchProgress.totalJobs,
            completedJobs: batchProgress.completedJobs,
            failedJobs: batchProgress.failedJobs,
            processingJobs: batchProgress.processingJobs,
            pendingJobs: batchProgress.pendingJobs,
          }
          SocketServer.emitBatchProgress(job.batchId, pusherObject)
        } catch (error) {
          Log.error('Error emitting batch progress to Pusher', { error })
        }
      }

      Log.info('Row processed', {
        jobId,
        batchId: job.batchId,
        rowIndex: job.rowIndex,
        status: result.status,
      })
    } catch (error) {
      // Manejar el error y programar reintento
      await QueueService.handleFailedJob(jobId)

      // Emitir error
      try {
        SocketServer.emitJobProgress(jobId, {
          jobId,
          dashboardId: job.dashboardId,
          status: SyncJobStatus.FAILED,
          retryCount: (job.result as unknown as JobResult)?.retryCount || 0,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      } catch (error) {
        Log.error('Error emitting job progress to Pusher', { error })
      }

      Log.error('Row processing failed', { error, jobId })
      throw error
    }
  }

  static async getBatchProgress(batchId: string): Promise<BatchProgress> {
    const jobs = await prisma.syncJob.findMany({
      where: { batchId },
      orderBy: { rowIndex: 'asc' },
    })

    const validSubmissions: RowTransactionSuccessResult[] = []
    const invalidSubmissions: RowTransactionErrorResult[] = []
    const skippedSubmissions: RowTransactionSkippedResult[] = []
    const updatedSubmissions: RowTransactionUpdatedResult[] = []
    const pendingSubmissions: RowTransactionPendingResult[] = []

    jobs.forEach((job) => {
      if (job.result) {
        const result = job.result as unknown as RowTransactionResult
        switch (result.status) {
          case SyncStatusEnum.SUCCESS:
            validSubmissions.push(result)
            break
          case SyncStatusEnum.SKIPPED:
            skippedSubmissions.push(result)
            break
          case SyncStatusEnum.UPDATED:
            updatedSubmissions.push(result)
            break
          case SyncStatusEnum.PENDING:
            pendingSubmissions.push(result)
            break
          default:
            invalidSubmissions.push(result)
        }
      }
    })

    return {
      totalJobs: jobs.length,
      completedJobs: jobs.filter((j) => j.status === SyncJobStatus.COMPLETED)
        .length,
      failedJobs: jobs.filter((j) => j.status === SyncJobStatus.FAILED).length,
      processingJobs: jobs.filter((j) => j.status === SyncJobStatus.PROCESSING)
        .length,
      pendingJobs: jobs.filter((j) => j.status === SyncJobStatus.PENDING)
        .length,
      validSubmissions,
      invalidSubmissions,
      skippedSubmissions,
      updatedSubmissions,
      pendingSubmissions,
      batchId,
      dashboardId: jobs[0].dashboardId,
    }
  }

  static async getJobProgress(jobId: string): Promise<SyncJobProgress> {
    const job = await prisma.syncJob.findUnique({
      where: { id: jobId },
    })

    const result = job?.result as unknown as JobResult

    return {
      jobId,
      status: job?.status || SyncJobStatus.PENDING,
      retryCount: result?.retryCount || 0,
      dashboardId: job?.dashboardId || '',
    }
  }

  static async cleanupOldJobs(daysToKeep: number = 7): Promise<{
    deletedCount: number
    keptCount: number
  }> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

    // Obtener jobs a eliminar
    const jobsToDelete = await prisma.syncJob.findMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
        status: {
          in: [SyncJobStatus.COMPLETED, SyncJobStatus.FAILED],
        },
      },
    })

    // Eliminar jobs
    const deletedCount = await prisma.syncJob.deleteMany({
      where: {
        id: {
          in: jobsToDelete.map((job) => job.id),
        },
      },
    })

    // Obtener conteo de jobs restantes
    const keptCount = await prisma.syncJob.count({
      where: {
        createdAt: {
          gte: cutoffDate,
        },
      },
    })

    Log.info('Old jobs cleaned up', {
      deletedCount: deletedCount.count,
      keptCount,
      daysToKeep,
    })

    return {
      deletedCount: deletedCount.count,
      keptCount,
    }
  }
}
