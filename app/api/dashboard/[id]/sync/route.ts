import { DashboardController } from '@/lib/controllers/dashboard/dashboard.controller'
import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const paramsObject = await params
  console.log('Force', request.nextUrl.searchParams.get('force'))
  const force = request.nextUrl.searchParams.get('force') === 'true'
  return DashboardController.syncDashboard(request, paramsObject, force)
}
