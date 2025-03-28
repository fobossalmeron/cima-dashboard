import { NextResponse } from 'next/server'
import { DashboardSyncService } from '@/lib/services/dashboard/sync/sync.service'
import { Log } from '@/lib/utils/log'
import { verifySignatureAppRouter } from '@upstash/qstash/nextjs'

async function handler(request: Request) {
  try {
    const { jobId } = await request.json()
    if (!jobId) {
      return NextResponse.json({ error: 'Missing jobId' }, { status: 400 })
    }

    await DashboardSyncService.processJob(jobId)

    return NextResponse.json({ success: true })
  } catch (error) {
    Log.error('Error processing sync job', { error })
    return NextResponse.json(
      { error: 'Error processing sync job' },
      { status: 500 },
    )
  }
}
export const POST = verifySignatureAppRouter(handler)
