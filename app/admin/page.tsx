'use client'

import { useState, useEffect } from 'react'
import { AdminHeader } from '@/components/headers'
import { DashboardsTable } from '@/components/tables'
import { NewDashboardForm } from '@/types/dashboard'
import { toast } from 'sonner'
import { NewDashboardDialog } from '@/components/dialogs/dashboard'
import { DashboardWithClientAndTemplate, ValidationResult } from '@/types/api'
import { SyncResults } from '@/components/sync/sync-results'
import { ApiStatus } from '@/enums/api-status'

export default function AdminPage() {
  const [dashboards, setDashboards] = useState<
    DashboardWithClientAndTemplate[]
  >([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [createDashboardLoading, setCreateDashboardLoading] =
    useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [syncResults, setSyncResults] = useState<ValidationResult | null>(null)
  const [isSyncing, setIsSyncing] = useState<boolean>(false)
  const [isCleaning, setIsCleaning] = useState<boolean>(false)

  const loadDashboards = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/dashboard')
      if (!response.ok) {
        throw new Error('Error al obtener los dashboards')
      }
      const data = await response.json()
      setDashboards(data.data)
    } catch (err) {
      setError('Error al cargar los dashboards')
      console.error('Error al cargar dashboards:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboards()
  }, [])

  const handleSubmit = async (data: NewDashboardForm) => {
    try {
      setCreateDashboardLoading(true)
      // Create the dashboard, client and form template
      const response = await fetch(`/api/form-templates`, {
        method: 'POST',
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        setCreateDashboardLoading(false)
        throw new Error(error.error || 'Error al crear el dashboard')
      }

      const result = await response.json()
      if (result.status === ApiStatus.SUCCESS) {
        toast.success('Dashboard creado exitosamente')
        loadDashboards()
        setIsDialogOpen(false)
        setCreateDashboardLoading(false)
      } else {
        throw new Error(result.error || 'Error al crear el dashboard')
      }
    } catch (error) {
      console.error('Error al crear dashboard:', error)
      toast.error('Error al crear el dashboard')
      setCreateDashboardLoading(false)
    }
  }

  const handleSyncDashboard = async (dashboardId: string) => {
    try {
      setIsSyncing(true)
      setSyncResults(null)

      const response = await fetch(`/api/dashboard/${dashboardId}/sync`)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al sincronizar el dashboard')
      }

      const result = await response.json()
      setSyncResults(result)
      toast.success('Dashboard sincronizado exitosamente')
      loadDashboards()
    } catch (error) {
      console.error('Error al sincronizar el dashboard:', error)
      toast.error(
        error instanceof Error
          ? error.message
          : 'Error al sincronizar el dashboard',
      )
    } finally {
      setIsSyncing(false)
    }
  }

  const handleClearDashboard = async (dashboardId: string) => {
    try {
      setIsCleaning(true)
      const response = await fetch(`/api/dashboard/${dashboardId}/clear`, {
        method: 'POST',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al limpiar el dashboard')
      }

      toast.success('Dashboard limpiado exitosamente')
      loadDashboards()
    } catch (error) {
      console.error('Error al limpiar el dashboard:', error)
      toast.error('Error al limpiar el dashboard')
    } finally {
      setIsCleaning(false)
    }
  }

  return (
    <div>
      <AdminHeader />
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-medium">
              Administrador de dashboards
            </h1>
            <p className="text-sm text-muted-foreground">
              Crea nuevos dashboards. Sincroniza si editaste un form submission
              recientemente.
            </p>
          </div>
          <NewDashboardDialog
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            handleSubmit={handleSubmit}
            loading={createDashboardLoading}
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Cargando clientes...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <>
            <DashboardsTable
              dashboards={dashboards}
              onSyncDashboard={handleSyncDashboard}
              onClearDashboard={handleClearDashboard}
              isSyncing={isSyncing}
              isCleaning={isCleaning}
            />
            {syncResults && (
              <SyncResults
                results={syncResults}
                onClose={() => setSyncResults(null)}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
