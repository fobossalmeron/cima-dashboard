import { DashboardController } from '@/lib/controllers/dashboard/dashboard.controller'
import { StartSyncResponse } from '@/types/services'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<StartSyncResponse>> {
  const paramsObject = await params
  const force = request.nextUrl.searchParams.get('force') === 'true'
  return DashboardController.syncDashboard(request, paramsObject, force)
}
