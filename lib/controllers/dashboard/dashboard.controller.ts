import { DashboardSyncService } from '@/lib/services/db'
import { RepslyApiService } from '@/lib/services/api'
import { NextRequest, NextResponse } from 'next/server'
import { SyncDashboardSuccessResponse } from '@/types/api'
import { ApiStatus } from '@/enums/api-status'

export class DashboardController {
  static async syncDashboard(request: NextRequest) {
    try {
      const { dashboardId, templateId } = await request.json()

      if (!dashboardId || !templateId) {
        return NextResponse.json(
          { error: 'Se requieren dashboardId y templateId' },
          { status: 400 },
        )
      }

      // Obtener datos de Repsly
      const repslyResponse = await RepslyApiService.syncDashboard(templateId)

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
}
