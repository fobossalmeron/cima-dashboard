import { NextRequest, NextResponse } from 'next/server'
import { DashboardSyncService } from '@/lib/services/dashboard/sync/sync.service'
import { Log } from '@/lib/utils/log'
import { verifySignatureAppRouter } from '@upstash/qstash/nextjs'
import { SyncJobStatus } from '@prisma/client'
import { SyncJobRepository } from '@/lib/repositories/jobs/sync-job.repository'

// Variable para controlar el procesamiento secuencial
let isProcessing = false

async function handler(request: NextRequest) {
  try {
    const { jobId } = await request.json()
    if (!jobId) {
      return NextResponse.json({ error: 'Missing jobId' }, { status: 400 })
    }

    // Si ya hay un job procesando, esperar
    if (isProcessing) {
      Log.info('Another job is being processed, waiting...', { jobId })
      return NextResponse.json(
        { message: 'Another job is being processed, will retry' },
        { status: 429 },
      )
    }

    try {
      isProcessing = true

      // Verificar que el job no esté ya procesando
      const job = await SyncJobRepository.getById(jobId)

      if (!job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 })
      }

      if (job.status === SyncJobStatus.PROCESSING) {
        Log.info('Job is already being processed', { jobId })
        return NextResponse.json(
          { message: 'Job is already being processed' },
          { status: 409 },
        )
      }

      // Procesar el job
      await DashboardSyncService.processJob(jobId)

      // Esperar 1 segundo antes de permitir el siguiente job
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return NextResponse.json({ success: true })
    } finally {
      isProcessing = false
    }
  } catch (error) {
    Log.error('Error processing sync job', { error })
    return NextResponse.json(
      { error: 'Error processing sync job' },
      { status: 500 },
    )
  }
}
export const POST = verifySignatureAppRouter(handler)
