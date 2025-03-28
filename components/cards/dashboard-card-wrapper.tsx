'use client'

import { useState } from 'react'
import { DashboardWithClientAndTemplate } from '@/types/api'
import { DashboardCard } from './dashboard.card'
import { SyncProgress } from '../sync/sync-progress'
import { SyncResults } from '../sync/sync-results'
import { ValidationResult } from '@/types/api'
import { toast } from 'sonner'
import { StartSyncSuccessResponse } from '@/types/services'

interface DashboardCardWrapperProps {
  dashboard: DashboardWithClientAndTemplate
  onClearDashboard: (dashboardId: string) => void
  onDeleteDashboard: (dashboardId: string) => void
  isCleaning: boolean
  isDeleting: boolean
  debugMode: boolean
}

export function DashboardCardWrapper({
  dashboard,
  onClearDashboard,
  onDeleteDashboard,
  isCleaning,
  isDeleting,
  debugMode,
}: DashboardCardWrapperProps) {
  const [isSyncing, setIsSyncing] = useState<boolean>(
    dashboard.SyncJob.length > 0,
  )
  const [syncResults, setSyncResults] = useState<ValidationResult | null>(null)

  const handleSyncDashboard = async () => {
    try {
      setIsSyncing(true)
      setSyncResults(null)

      const response = await fetch(
        `/api/dashboard/${dashboard.id}/sync?force=true`,
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al sincronizar el dashboard')
      }

      const data = (await response.json()) as StartSyncSuccessResponse

      toast.success('Iniciando sincronización...', {
        description: `Sincronizando ${data.totalJobs} submissions`,
      })
    } catch (error) {
      console.error('Error al sincronizar el dashboard:', error)
      toast.error(
        error instanceof Error
          ? error.message
          : 'Error al sincronizar el dashboard',
      )
      setIsSyncing(false)
    }
  }

  return (
    <div className="space-y-4">
      <DashboardCard
        dashboard={dashboard}
        onSyncDashboard={handleSyncDashboard}
        onClearDashboard={onClearDashboard}
        onDeleteDashboard={onDeleteDashboard}
        isSyncing={isSyncing}
        isCleaning={isCleaning}
        isDeleting={isDeleting}
        debugMode={debugMode}
      />
      {isSyncing && (
        <SyncProgress
          dashboardId={dashboard.id}
          onComplete={() => setIsSyncing(false)}
        />
      )}
      {syncResults && (
        <SyncResults
          results={syncResults}
          onClose={() => setSyncResults(null)}
        />
      )}
    </div>
  )
}
