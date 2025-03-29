import { NextResponse } from 'next/server'
import { DashboardSyncService, DatabaseQueueService } from '@/lib/services'
import { Log } from '@/lib/utils/log'

export async function GET() {
  try {
    // Obtener el siguiente job pendiente
    const job = await DatabaseQueueService.getNextJob()

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
