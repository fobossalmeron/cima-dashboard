import { ApiStatus } from '@/enums/api-status'
import {
  DashboardService,
  DashboardSyncService,
  RepslyAuthService,
  SyncLogService,
} from '@/lib/services'
import { RepslyApiService } from '@/lib/services/api'
import { SyncDashboardSuccessResponse } from '@/types/api'
import { SyncStatus } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { SlackService } from '@/lib/services/slack/slack.service'
import { Log } from '@/lib/utils/log'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Check if token was expired
    const tokenData = await RepslyAuthService.getToken()
    if (RepslyAuthService.isTokenExpired(tokenData)) {
      throw new Error('Token expirado')
    }
    const dashboards = await DashboardService.getAllWithLogs()
    let successCount = 0
    let errorCount = 0
    const errorDetails: string[] = []

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
        errorCount++
        errorDetails.push(
          `Error en ${dashboard.client.name}: ${repslyResponse.error}`,
        )
        Log.error('Error getting submissions from repsly', {
          error: repslyResponse.error,
          dashboard: dashboard.client.name,
        })
        await SyncLogService.create(
          dashboard.id,
          SyncStatus.ERROR,
          repslyResponse.error,
        )
        continue
      } else {
        const successResponse = repslyResponse as SyncDashboardSuccessResponse
        try {
          await DashboardSyncService.startSync(
            dashboard.id,
            successResponse.data,
            false,
          )
          successCount++
          Log.info('Dashboard synced successfully', {
            dashboard: dashboard.client.name,
          })
          await SyncLogService.create(dashboard.id, SyncStatus.SUCCESS)
        } catch (error) {
          errorCount++
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error'
          errorDetails.push(
            `Error en ${dashboard.client.name}: ${errorMessage}`,
          )
          Log.error('Error syncing dashboard', {
            error: errorMessage,
            dashboard: dashboard.client.name,
          })
          await SyncLogService.create(
            dashboard.id,
            SyncStatus.ERROR,
            errorMessage,
          )
        }
      }
    }

    const details = `Dashboards sincronizados: ${successCount}\nDashboards con error: ${errorCount}\n${
      errorDetails.length > 0 ? `\nErrores:\n${errorDetails.join('\n')}` : ''
    }`

    await SlackService.sendCronJobNotification(
      'Sincronización de Dashboards',
      errorCount === 0 ? 'success' : 'error',
      details,
    )

    return Response.json({ status: 'Dashboards synced successfully', details })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    await SlackService.sendCronJobNotification(
      'Sincronización de Dashboards',
      'error',
      `Error general: ${errorMessage}`,
    )
    Log.error('Error syncing dashboards', { error: errorMessage })
    return Response.json(
      { error: 'Failed to sync dashboards' },
      { status: 500 },
    )
  }
}
