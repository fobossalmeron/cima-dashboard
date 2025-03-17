'use client'

import { useState, useEffect } from 'react'
import { AdminHeader } from '@/components/headers'
import { DashboardsTable } from '@/components/tables'
import { NewDashboardForm } from '@/types/dashboard'
import { toast } from 'sonner'
import { NewDashboardDialog } from '@/components/dialogs/dashboard'
import {
  RepslyApiService,
  FormTemplateApiService,
  ClientsApiService,
  ProductsApiService,
} from '@/lib/services/api'
import {
  ClientData,
  DashboardWithClientAndTemplate,
  ValidationResult,
} from '@/types/api'
import { DashboardsApiService } from '@/lib/services/api'
import { SyncResults } from '@/components/sync/sync-results'

export default function AdminPage() {
  const [clients, setClients] = useState<ClientData[]>([])
  const [dashboards, setDashboards] = useState<
    DashboardWithClientAndTemplate[]
  >([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [syncResults, setSyncResults] = useState<ValidationResult | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)

  const loadClients = async () => {
    try {
      setIsLoading(true)
      const data = await ClientsApiService.getAll()
      setClients(data)
    } catch (err) {
      setError('Error al cargar los clientes')
      console.error('Error al cargar clientes:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadDashboards = async () => {
    try {
      setIsLoading(true)
      const data = await DashboardsApiService.getAll()
      setDashboards(data)
    } catch (err) {
      setError('Error al cargar los dashboards')
      console.error('Error al cargar dashboards:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadClients()
    loadDashboards()
  }, [])

  const handleSubmit = async (data: NewDashboardForm) => {
    try {
      // Obtener el template de Repsly
      const formTemplateResponse = await fetch(
        `/api/repsly/forms/${data.formId}`,
      )
      if (!formTemplateResponse.ok) {
        throw new Error(formTemplateResponse.statusText)
      }

      // Encontrar el cliente seleccionado
      const selectedClient = clients.find(
        (client) => client.id.toString() === data.clientId,
      )
      if (!selectedClient) {
        throw new Error('No se encontró el cliente')
      }
      const { data: formTemplate } = await formTemplateResponse.json()
      console.log('Form template:', formTemplate)
      const dashboardName = data.name
      // Guardar el template en nuestra base de datos
      const template = await FormTemplateApiService.create(
        formTemplate,
        selectedClient,
        dashboardName,
      )

      await ProductsApiService.loadFromTemplate(template.id)

      toast.success('Dashboard creado exitosamente')
      loadDashboards()
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error al crear dashboard:', error)
      toast.error('Error al crear el dashboard')
    }
  }

  const handleSyncDashboard = async (
    dashboardId: string,
    templateId: string,
  ) => {
    try {
      setIsSyncing(true)
      setSyncResults(null)
      const response = await RepslyApiService.syncDashboard(templateId)
      if (!response.data) {
        throw new Error('No se recibieron datos del formulario')
      }

      const syncResponse = await DashboardsApiService.sync(
        dashboardId,
        response.data,
      )
      if (syncResponse.error) {
        throw new Error(syncResponse.error)
      }

      setSyncResults(syncResponse.data)
      toast.success('Dashboard sincronizado exitosamente')
      loadDashboards()
    } catch (error) {
      console.error('Error al sincronizar el dashboard:', error)
      toast.error('Error al sincronizar el dashboard')
    } finally {
      setIsSyncing(false)
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
            clients={clients}
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
              isSyncing={isSyncing}
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
