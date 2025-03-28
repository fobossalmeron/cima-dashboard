import { NextResponse } from 'next/server'
import { DashboardSyncService } from '@/lib/services/dashboard/sync/sync.service'
import { Log } from '@/lib/utils/log'

export async function GET(
  request: Request,
  { params }: { params: { jobId: string } },
) {
  try {
    const { jobId } = params
    if (!jobId) {
      return NextResponse.json({ error: 'Missing jobId' }, { status: 400 })
    }

    const progress = await DashboardSyncService.getJobProgress(jobId)

    return NextResponse.json(progress)
  } catch (error) {
    Log.error('Error getting sync progress', { error })
    return NextResponse.json(
      { error: 'Error getting sync progress' },
      { status: 500 },
    )
  }
}
