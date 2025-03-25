'use client'
import { DashboardWithClientAndTemplate } from '@/types/api'
import { DashboardCard } from '../cards/dashboard.card'

interface DashboardsTableProps {
  dashboards: DashboardWithClientAndTemplate[]
  onSyncDashboard: (dashboardId: string) => void
  onClearDashboard: (dashboardId: string) => void
  onDeleteDashboard: (dashboardId: string) => void
  isSyncing: boolean
  isCleaning: boolean
  isDeleting: boolean
  debugMode: boolean
}

export function DashboardsTable({
  dashboards,
  onSyncDashboard,
  onClearDashboard,
  onDeleteDashboard,
  isSyncing,
  isCleaning,
  isDeleting,
  debugMode,
}: DashboardsTableProps) {
  return (
    <div className="grid gap-4">
      {dashboards.map((dashboard) => (
        <DashboardCard
          key={dashboard.id}
          dashboard={dashboard}
          onSyncDashboard={onSyncDashboard}
          onClearDashboard={onClearDashboard}
          onDeleteDashboard={onDeleteDashboard}
          isSyncing={isSyncing}
          isCleaning={isCleaning}
          isDeleting={isDeleting}
          debugMode={debugMode}
        />
      ))}
    </div>
  )
}
