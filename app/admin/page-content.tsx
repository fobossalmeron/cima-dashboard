'use client'

import { useState, useEffect } from 'react'
import { NewDashboardForm } from '@/types/dashboard'
import { toast } from 'sonner'
import { NewDashboardDialog } from '@/components/dialogs/dashboard'
import {
  DashboardWithClientAndTemplate,
  FormTemplateResponse,
} from '@/types/api'
import { ApiStatus } from '@/enums/api-status'
import { useSearchParams } from 'next/navigation'
import { DashboardsTable } from '@/components/tables/dashboards.table'

export default function AdminPageContent() {
  const searchParams = useSearchParams()
  const debugMode =
    searchParams.get('debug') !== null && searchParams.get('debug') === 'true'
  const [dashboards, setDashboards] = useState<
    DashboardWithClientAndTemplate[]
  >([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [createDashboardLoading, setCreateDashboardLoading] =
    useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [cleaningDashboard, setCleaningDashboard] = useState<string | null>(
    null,
  )
  const [deletingDashboard, setDeletingDashboard] = useState<string | null>(
    null,
  )
  const [isUpdatingTemplate, setIsUpdatingTemplate] = useState<boolean>(false)

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
      const response = await fetch(`/api/form-templates`, {
        method: 'POST',
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        setCreateDashboardLoading(false)
        throw new Error(error.error || 'Error al crear el dashboard')
      }

      const result = (await response.json()) as FormTemplateResponse
      if (result.status === ApiStatus.SUCCESS) {
        toast.success('Dashboard creado exitosamente', {
          description: 'Sincronizando dashboard...',
          duration: 5000,
        })
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

  const handleClearDashboard = async (dashboardId: string) => {
    try {
      setCleaningDashboard(dashboardId)
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
      setCleaningDashboard(null)
    }
  }

  const handleDeleteDashboard = async (dashboardId: string) => {
    try {
      setDeletingDashboard(dashboardId)
      const response = await fetch(`/api/dashboard/${dashboardId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al eliminar el dashboard')
      }

      toast.success('Dashboard eliminado exitosamente')
      loadDashboards()
    } catch (error) {
      console.error('Error al eliminar el dashboard:', error)
      toast.error('Error al eliminar el dashboard')
    } finally {
      setDeletingDashboard(null)
    }
  }

  const handleUpdateTemplate = async (templateId: string) => {
    try {
      setIsUpdatingTemplate(true)
      const response = await fetch(`/api/form-templates/${templateId}`, {
        method: 'PUT',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al actualizar el template')
      } else {
        const result = await response.json()
        if (result.status === ApiStatus.SUCCESS) {
          toast.success('Plantilla actualizada exitosamente')
        } else {
          throw new Error(result.error || 'Error al actualizar el template')
        }
      }

      toast.success('Plantilla actualizada exitosamente')
    } catch (error) {
      console.error('Error al actualizar el template:', error)
      toast.error('Error al actualizar el template')
    } finally {
      setIsUpdatingTemplate(false)
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-medium">Administrador de dashboards</h1>
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
        <DashboardsTable
          dashboards={dashboards}
          onClearDashboard={handleClearDashboard}
          onDeleteDashboard={handleDeleteDashboard}
          cleaningDashboard={cleaningDashboard}
          deletingDashboard={deletingDashboard}
          debugMode={debugMode}
          onUpdateTemplate={handleUpdateTemplate}
          isUpdatingTemplate={isUpdatingTemplate}
        />
      )}
    </div>
  )
}
