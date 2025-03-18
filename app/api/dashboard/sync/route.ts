import { DashboardController } from '@/lib/controllers/dashboard/dashboard.controller'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  return DashboardController.syncDashboard(req)
}
