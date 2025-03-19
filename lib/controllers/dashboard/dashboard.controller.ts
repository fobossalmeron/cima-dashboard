import { DashboardService, DashboardSyncService } from '@/lib/services'
import { RepslyApiService } from '@/lib/services/api'
import { NextRequest, NextResponse } from 'next/server'
import { SyncDashboardSuccessResponse } from '@/types/api'
import { ApiStatus } from '@/enums/api-status'

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

      // Obtener datos de Repsly
      const repslyResponse = await RepslyApiService.syncDashboard(
        dashboard.templateId,
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
}
