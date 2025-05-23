import {
  ClientsService,
  DashboardService,
  DashboardSyncService,
  FormTemplateService,
  SyncLogService,
} from '@/lib/services'
import { RepslyApiService } from '@/lib/services/api'
import { NextRequest, NextResponse } from 'next/server'
import { SyncDashboardSuccessResponse } from '@/types/api'
import { DashboardFilters, DateRange } from '@/types/services/dashboard.types'
import { StartSyncResponse } from '@/types/services'
import { SyncStatus } from '@prisma/client'

export class DashboardController {
  static async syncDashboard(
    request: NextRequest,
    params: { id: string },
    force?: boolean,
  ): Promise<NextResponse<StartSyncResponse>> {
    try {
      const { id: dashboardId } = params
      const dashboard = await DashboardService.getById(dashboardId)

      if (!dashboard) {
        return NextResponse.json(
          { error: 'Dashboard not found' },
          { status: 404 },
        )
      }

      let dateRange: DateRange | null = null

      if (!force) {
        const lastSyncLog =
          dashboard.syncLogs.length > 0 ? dashboard.syncLogs[0] : null
        dateRange = lastSyncLog
          ? {
              startDate: new Date(lastSyncLog.createdAt),
              endDate: new Date(),
            }
          : null
      }

      // Obtener datos de Repsly
      const repslyResponse = await RepslyApiService.syncDashboard(
        dashboard.templateId,
        dateRange,
      )

      const successResponse = repslyResponse as SyncDashboardSuccessResponse

      // Create sync jobs for each submission
      const result = await DashboardSyncService.startSync(
        dashboardId,
        successResponse.data,
        force,
      )

      // Create sync log for register last sync date
      await SyncLogService.create(dashboard.id, SyncStatus.SUCCESS)

      return NextResponse.json(result)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const body = {
        message: error.message,
        type: error.name ?? error.type,
      }

      return new NextResponse(JSON.stringify(body), {
        status: error.statusCode,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
  }

  static async clearDashboard(request: NextRequest, params: { id: string }) {
    try {
      const { id: dashboardId } = params

      if (!dashboardId) {
        return NextResponse.json(
          { error: 'dashboardId missing' },
          { status: 400 },
        )
      }

      await DashboardService.clear(dashboardId)

      return NextResponse.json(
        { message: 'Dashboard cleared' },
        { status: 200 },
      )
    } catch (error) {
      console.error('Error clearing dashboard:', error)
      return NextResponse.json(
        { error: 'Error clearing dashboard' },
        { status: 500 },
      )
    }
  }

  static async getDashboard(request: NextRequest, params: { id: string }) {
    const { id: dashboardId } = params
    const { searchParams } = new URL(request.url)

    // Leer los parámetros individuales
    const dateRange = searchParams.get('dateRange')
    const brandIds = searchParams.get('brandIds')
    const city = searchParams.get('city')
    const locationId = searchParams.get('locationId')

    // Parsear los valores si es necesario
    const parsedFilters: DashboardFilters = {
      dateRange: dateRange ? JSON.parse(dateRange) : undefined,
      brandIds: brandIds ? brandIds.split(',') : [],
      city: city || undefined,
      locationId: locationId || undefined,
    }

    const dashboard = await DashboardService.getById(dashboardId, parsedFilters)
    return NextResponse.json(dashboard)
  }

  static async deleteDashboard(request: NextRequest, params: { id: string }) {
    const { id: dashboardId } = params
    try {
      const dashboard = await DashboardService.remove(dashboardId)
      await ClientsService.remove(dashboard.clientId)
      const template = await FormTemplateService.getByIdWithDashboardsCount(
        dashboard.templateId,
      )
      if (template && template._count.dashboards === 0) {
        await FormTemplateService.remove(template.id)
      }
      return NextResponse.json(
        { message: 'Dashboard deleted' },
        { status: 200 },
      )
    } catch (error) {
      console.error('Error deleting dashboard:', error)
      return NextResponse.json(
        { error: 'Error deleting dashboard' },
        { status: 500 },
      )
    }
  }
}
