'use client'
import { DashboardWithClientAndTemplate } from '@/types/api'
import { DashboardCardWrapper } from '@/components/cards/dashboard-card-wrapper'

interface DashboardsTableProps {
  dashboards: DashboardWithClientAndTemplate[]
  onClearDashboard: (dashboardId: string) => void
  onDeleteDashboard: (dashboardId: string) => void
  cleaningDashboard: string | null
  deletingDashboard: string | null
  debugMode: boolean
}

export function DashboardsTable({
  dashboards,
  onClearDashboard,
  onDeleteDashboard,
  cleaningDashboard,
  deletingDashboard,
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
          cleaningDashboard={cleaningDashboard}
          deletingDashboard={deletingDashboard}
          debugMode={debugMode}
        />
      ))}
    </div>
  )
}
