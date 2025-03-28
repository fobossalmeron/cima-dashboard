import { Log } from '@/lib/utils/log'
import { JobResult } from '@/types/services/sync.types'
import { prisma } from '@/lib/prisma'
import { SyncJobStatus } from '@prisma/client'
import { QueueService } from './queue.service'
import { InputJsonValue } from '@prisma/client/runtime/library'

const MAX_RETRIES = 3
const RETRY_DELAY = 5000 // 5 segundos

export class RetryService {
  static async handleFailedJob(jobId: string): Promise<void> {
    const job = await prisma.syncJob.findUnique({
      where: { id: jobId },
    })

    if (!job) {
      Log.error('Job not found for retry', { jobId })
      return
    }

    const result = job.result as unknown as JobResult
    const retryCount = result?.retryCount || 0

    if (retryCount >= MAX_RETRIES) {
      Log.error('Max retries reached for job', { jobId, retryCount })
      await prisma.syncJob.update({
        where: { id: jobId },
        data: {
          status: SyncJobStatus.FAILED,
          error: `Max retries (${MAX_RETRIES}) reached`,
        },
      })
      return
    }

    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))

    await prisma.syncJob.update({
      where: { id: jobId },
      data: {
        status: SyncJobStatus.PENDING,
        result: {
          ...result,
          retryCount: retryCount + 1,
        } as unknown as InputJsonValue,
      },
    })

    await QueueService.publishSyncJob({
      jobId,
      dashboardId: job.dashboardId,
      data: job.data,
    })

    Log.info('Job retry scheduled', { jobId, retryCount: retryCount + 1 })
  }
}
