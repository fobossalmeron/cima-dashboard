import { NextResponse } from 'next/server'
import { DashboardSyncService } from '@/lib/services/dashboard/sync/sync.service'
import { Log } from '@/lib/utils/log'
import { verifySignatureAppRouter } from '@upstash/qstash/nextjs'
import { LocalQueueService } from '@/lib/services'

async function handler() {
  try {
    // Obtener el siguiente job pendiente
    const job = await LocalQueueService.getNextJob()

    if (!job) {
      return NextResponse.json({ message: 'No pending jobs' })
    }

    // Procesar el job
    await DashboardSyncService.processJob(job.id)

    return NextResponse.json({ success: true, jobId: job.id })
  } catch (error) {
    Log.error('Error processing sync job', { error })
    return NextResponse.json(
      { error: 'Error processing sync job' },
      { status: 500 },
    )
  }
}
export const POST = verifySignatureAppRouter(handler)
