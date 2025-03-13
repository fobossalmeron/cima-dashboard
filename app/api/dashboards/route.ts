import { prisma } from '@/lib/prisma'
import {
  DashboardErrorResponse,
  DashboardResponse,
  DashboardSuccessResponse,
  DashboardWithClientAndTemplate,
} from '@/types/api'
import { NextResponse } from 'next/server'

export async function GET(): Promise<NextResponse<DashboardResponse>> {
  try {
    const dashboards = (await prisma.dashboard.findMany({
      include: {
        client: true,
        template: true,
      },
    })) as DashboardWithClientAndTemplate[]

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
