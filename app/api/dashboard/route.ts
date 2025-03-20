import { NextResponse } from 'next/server'
import { DashboardService } from '@/lib/services'
import { withAuth } from '@/lib/services/auth/decorators/auth.decorator'
import { DashboardErrorResponse, DashboardSuccessResponse } from '@/types/api'

export const GET = withAuth(async () => {
  try {
    const dashboards = await DashboardService.getAll()

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
})
