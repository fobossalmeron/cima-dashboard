'use client'
import { DashboardWithClientAndTemplate } from '@/types/api'
import { DashboardCard } from '../cards/dashboard.card'

interface DashboardsTableProps {
  dashboards: DashboardWithClientAndTemplate[]
  onSyncDashboard: (dashboardId: string) => void
  onClearDashboard: (dashboardId: string) => void
  isSyncing: boolean
  isCleaning: boolean
}

export function DashboardsTable({
  dashboards,
  onSyncDashboard,
  onClearDashboard,
  isSyncing,
  isCleaning,
}: DashboardsTableProps) {
  return (
    <div className="grid gap-4">
      {dashboards.map((dashboard) => (
        <DashboardCard
          key={dashboard.id}
          dashboard={dashboard}
          onSyncDashboard={onSyncDashboard}
          onClearDashboard={onClearDashboard}
          isSyncing={isSyncing}
          isCleaning={isCleaning}
        />
      ))}
    </div>
  )
}
