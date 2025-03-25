import { DashboardController } from '@/lib/controllers'
import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  return await DashboardController.getDashboard(request, { id })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  return await DashboardController.deleteDashboard(request, { id })
}
