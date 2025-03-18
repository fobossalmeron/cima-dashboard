'use client'
import { DashboardWithClientAndTemplate } from '@/types/api'
import { DashboardCard } from '../cards/dashboard.card'

interface DashboardsTableProps {
  dashboards: DashboardWithClientAndTemplate[]
  onSyncDashboard: (dashboardId: string, templateId: string) => void
  isSyncing: boolean
}

export function DashboardsTable({
  dashboards,
  onSyncDashboard,
  isSyncing,
}: DashboardsTableProps) {
  return (
    <div className="grid gap-4">
      {dashboards.map((dashboard) => (
        <DashboardCard
          key={dashboard.id}
          dashboard={dashboard}
          onSyncDashboard={onSyncDashboard}
          isSyncing={isSyncing}
        />
      ))}
    </div>
  )
}
