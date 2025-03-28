import { NextResponse } from 'next/server'
import { DashboardSyncService } from '@/lib/services/dashboard/sync/sync.service'
import { Log } from '@/lib/utils/log'

export async function POST(request: Request) {
  try {
    const { daysToKeep = 7 } = await request.json()

    const result = await DashboardSyncService.cleanupOldJobs(daysToKeep)

    return NextResponse.json(result)
  } catch (error) {
    Log.error('Error cleaning up old jobs', { error })
    return NextResponse.json(
      { error: 'Error cleaning up old jobs' },
      { status: 500 },
    )
  }
}
