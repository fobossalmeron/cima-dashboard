import { NextResponse } from 'next/server'
import { DashboardSyncService } from '@/lib/services/dashboard/sync/sync.service'
import { Log } from '@/lib/utils/log'

export async function POST(request: Request) {
  try {
    const { id, formData } = await request.json()

    if (!id || !formData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    const { batchId, totalJobs } = await DashboardSyncService.startSync(
      id,
      formData,
    )

    return NextResponse.json({ batchId, totalJobs })
  } catch (error) {
    Log.error('Error starting sync', { error })
    return NextResponse.json({ error: 'Error starting sync' }, { status: 500 })
  }
}
