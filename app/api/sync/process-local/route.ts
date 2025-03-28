import { NextResponse } from 'next/server'
import { DashboardSyncService } from '@/lib/services/dashboard/sync/sync.service'
import { LocalQueueService } from '@/lib/services/queues/local-queue.service'
import { Log } from '@/lib/utils/log'

export async function GET() {
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
    Log.error('Error processing local job', { error })
    return NextResponse.json(
      { error: 'Error processing local job' },
      { status: 500 },
    )
  }
}
