import {
  ClientsService,
  DashboardService,
  DashboardSyncService,
  FormTemplateService,
} from '@/lib/services'
import { RepslyApiService } from '@/lib/services/api'
import { NextRequest, NextResponse } from 'next/server'
import { SyncDashboardSuccessResponse } from '@/types/api'
import { ApiStatus } from '@/enums/api-status'
import { DashboardFilters } from '@/types/services/dashboard.types'

export class DashboardController {
  static async syncDashboard(request: NextRequest, params: { id: string }) {
    try {
      const { id: dashboardId } = params
      const dashboard = await DashboardService.getById(dashboardId)

      if (!dashboard) {
        return NextResponse.json(
          { error: 'Dashboard not found' },
          { status: 404 },
        )
      }

      const lastSyncLog =
        dashboard.syncLogs.length > 0 ? dashboard.syncLogs[0] : null
      const dateRange = lastSyncLog
        ? {
            startDate: new Date(lastSyncLog.createdAt),
            endDate: new Date(),
          }
        : null

      // Obtener datos de Repsly
      const repslyResponse = await RepslyApiService.syncDashboard(
        dashboard.templateId,
        dateRange,
      )

      if (repslyResponse.status === ApiStatus.ERROR) {
        return NextResponse.json(
          { error: repslyResponse.error },
          { status: 400 },
        )
      }

      const successResponse = repslyResponse as SyncDashboardSuccessResponse

      // Sincronizar con la base de datos local
      const result = await DashboardSyncService.sync(
        dashboardId,
        successResponse.data,
      )
      return NextResponse.json(result)
    } catch (error) {
      console.error('Error al sincronizar dashboard:', error)
      return NextResponse.json(
        { error: 'Error al sincronizar el dashboard' },
        { status: 500 },
      )
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
