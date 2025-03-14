'use client'

import { useState, useEffect } from 'react'
import { ClientData } from '@/types/api'
import { AdminHeader } from '@/components/headers'
import { ClientsTable } from '@/components/tables'
import { NewDashboardForm } from '@/types/dashboard'
import { toast } from 'sonner'
import { NewDashboardDialog } from '@/components/dialogs/dashboard'
import {
  ClientsApiService,
  RepslyApiService,
  FormTemplateApiService,
} from '@/lib/services/api'

export default function AdminPage() {
  const [clients, setClients] = useState<ClientData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
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
    loadClients()
  }, [])

  const handleSubmit = async (data: NewDashboardForm) => {
    try {
      console.log('Data:', data)
      // Obtener el template de Repsly
      const formTemplateResponse = await RepslyApiService.getFormTemplate(
        data.formId,
      )
      if (!formTemplateResponse.data) {
        throw new Error('No se encontró el formulario')
      }

      // Encontrar el cliente seleccionado
      const selectedClient = clients.find(
        (client) => client.id.toString() === data.clientId,
      )
      if (!selectedClient) {
        throw new Error('No se encontró el cliente')
      }
      const formTemplate = formTemplateResponse.data
      const dashboardName = data.name
      // Guardar el template en nuestra base de datos
      await FormTemplateApiService.create(
        formTemplate,
        selectedClient,
        dashboardName,
      )

      toast.success('Dashboard creado exitosamente')
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error al crear dashboard:', error)
      toast.error('Error al crear el dashboard')
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
          <ClientsTable clients={clients} />
        )}
      </div>
    </div>
  )
}
