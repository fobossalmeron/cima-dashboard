import {
  DashboardErrorResponse,
  DashboardResponse,
  DashboardSuccessResponse,
} from '@/types/api'
import { DashboardsService } from '@/lib/services/db'
import { NextResponse } from 'next/server'

export async function GET(): Promise<NextResponse<DashboardResponse>> {
  try {
    const dashboards = await DashboardsService.getAll()

    return NextResponse.json<DashboardSuccessResponse>({
      data: dashboards,
      error: null,
    })
  } catch (error) {
    console.error('Error al obtener dashboards:', error)
    return NextResponse.json<DashboardErrorResponse>(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 },
    )
  }
}
