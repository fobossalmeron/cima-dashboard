import { ApiStatus } from '@/enums/api-status'
import {
  DashboardService,
  DashboardSyncService,
  SyncLogService,
} from '@/lib/services'
import { RepslyApiService } from '@/lib/services/api'
import { SyncDashboardSuccessResponse } from '@/types/api'
import { SyncStatus } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const dashboards = await DashboardService.getAllWithLogs()
    for (const dashboard of dashboards) {
      const lastSyncLog =
        dashboard.syncLogs.length > 0 ? dashboard.syncLogs[0] : null
      const dateRange = lastSyncLog
        ? {
            startDate: new Date(lastSyncLog.createdAt),
            endDate: new Date(),
          }
        : null
      const repslyResponse = await RepslyApiService.syncDashboard(
        dashboard.templateId,
        dateRange,
      )
      if (repslyResponse.status === ApiStatus.ERROR) {
        console.error(
          'Error getting submissions from repsly:',
          repslyResponse.error,
        )
        await SyncLogService.create(
          dashboard.id,
          SyncStatus.ERROR,
          repslyResponse.error,
        )
        continue
      } else {
        const successResponse = repslyResponse as SyncDashboardSuccessResponse
        try {
          await DashboardSyncService.sync(dashboard.id, successResponse.data)
          console.log('Dashboard synced successfully:', dashboard.client.name)
          await SyncLogService.create(dashboard.id, SyncStatus.SUCCESS)
        } catch (error) {
          console.error('Error syncing dashboard:', error)
          await SyncLogService.create(
            dashboard.id,
            SyncStatus.ERROR,
            error instanceof Error ? error.message : 'Unknown error',
          )
        }
      }
    }
    return Response.json({ status: 'Dashboards synced successfully' })
  } catch (error) {
    console.error('Error syncing dashboards:', error)
    return Response.json(
      { error: 'Failed to sync dashboards' },
      { status: 500 },
    )
  }
}
