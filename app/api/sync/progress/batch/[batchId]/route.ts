import { NextResponse } from 'next/server'
import { DashboardSyncService } from '@/lib/services/dashboard/sync/sync.service'
import { Log } from '@/lib/utils/log'

export async function GET(
  request: Request,
  { params }: { params: { batchId: string } },
) {
  try {
    const { batchId } = params
    if (!batchId) {
      return NextResponse.json({ error: 'Missing batchId' }, { status: 400 })
    }

    const progress = await DashboardSyncService.getBatchProgress(batchId)

    return NextResponse.json(progress)
  } catch (error) {
    Log.error('Error getting sync progress', { error })
    return NextResponse.json(
      { error: 'Error getting sync progress' },
      { status: 500 },
    )
  }
}
