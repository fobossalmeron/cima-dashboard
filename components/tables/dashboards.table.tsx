'use client'
import { DashboardWithClientAndTemplate } from '@/types/api'
import { DashboardCardWrapper } from '@/components/cards/dashboard-card-wrapper'

interface DashboardsTableProps {
  dashboards: DashboardWithClientAndTemplate[]
  onClearDashboard: (dashboardId: string) => void
  onDeleteDashboard: (dashboardId: string) => void
  isCleaning: boolean
  isDeleting: boolean
  debugMode: boolean
}

export function DashboardsTable({
  dashboards,
  onClearDashboard,
  onDeleteDashboard,
  isCleaning,
  isDeleting,
  debugMode,
}: DashboardsTableProps) {
  return (
    <div className="grid gap-4">
      {dashboards.map((dashboard) => (
        <DashboardCardWrapper
          key={dashboard.id}
          dashboard={dashboard}
          onClearDashboard={onClearDashboard}
          onDeleteDashboard={onDeleteDashboard}
          isCleaning={isCleaning}
          isDeleting={isDeleting}
          debugMode={debugMode}
        />
      ))}
    </div>
  )
}
