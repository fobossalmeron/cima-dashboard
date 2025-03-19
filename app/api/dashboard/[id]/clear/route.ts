import { DashboardController } from '@/lib/controllers'
import { NextRequest } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  return DashboardController.clearDashboard(request, { id })
}
