'use client'

import { useState } from 'react'
import { DashboardWithClientAndTemplate } from '@/types/api'
import { DashboardCard } from './dashboard.card'
import { SyncProgress } from '../sync/sync-progress'
import { SyncResults } from '../sync/sync-results'
import { ValidationResult } from '@/types/api'
import { toast } from 'sonner'
import { StartSyncSuccessResponse } from '@/types/services'
import { SyncStatus } from '@prisma/client'

interface DashboardCardWrapperProps {
  dashboard: DashboardWithClientAndTemplate
  onClearDashboard: (dashboardId: string) => void
  onDeleteDashboard: (dashboardId: string) => void
  cleaningDashboard: string | null
  deletingDashboard: string | null
  debugMode: boolean
}

export function DashboardCardWrapper({
  dashboard,
  onClearDashboard,
  onDeleteDashboard,
  cleaningDashboard,
  deletingDashboard,
  debugMode,
}: DashboardCardWrapperProps) {
  const [isSyncing, setIsSyncing] = useState<boolean>(
    dashboard.SyncJob.length > 0,
  )
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null)
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
        throw new Error(
          error.message || error.error || 'Error al sincronizar el dashboard',
        )
      }

      const data = (await response.json()) as StartSyncSuccessResponse

      toast.success('Iniciando sincronización...', {
        description: data.message,
      })
    } catch (error) {
      toast.error('Error al sincronizar el dashboard', {
        description:
          error instanceof Error
            ? error.message
            : 'Error al sincronizar el dashboard',
      })
      setIsSyncing(false)
    }
  }

  const handleSyncComplete = () => {
    setIsSyncing(false)
    setSyncStatus(SyncStatus.SUCCESS)
  }

  const handleSyncClose = () => {
    setSyncStatus(null)
    setIsSyncing(false)
  }

  return (
    <div className="space-y-4">
      <DashboardCard
        dashboard={dashboard}
        onSyncDashboard={handleSyncDashboard}
        onClearDashboard={onClearDashboard}
        onDeleteDashboard={onDeleteDashboard}
        isSyncing={isSyncing}
        isCleaning={cleaningDashboard === dashboard.id}
        isDeleting={deletingDashboard === dashboard.id}
        debugMode={debugMode}
      />
      {(isSyncing || syncStatus === SyncStatus.SUCCESS) && (
        <SyncProgress
          dashboardId={dashboard.id}
          onComplete={handleSyncComplete}
          onClose={handleSyncClose}
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
