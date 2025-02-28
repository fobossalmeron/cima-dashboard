'use client'

import { useState, useEffect } from 'react'
import { ClientData } from '@/types/ClientData'
import Link from 'next/link'
import { getClients } from '@/lib/db/get-clients'
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DashboardForm } from '@/components/dashboard-form'

export default function AdminPage() {
  const [clients, setClients] = useState<ClientData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newClient, setNewClient] = useState({
    name: '',
    slug: '',
    formId: ''
  })

  useEffect(() => {
    const loadClients = async () => {
      try {
        setIsLoading(true)
        const data = await getClients()
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para crear un nuevo dashboard
    alert('Dashboard creado! (simulación)')
    setIsDialogOpen(false)
    setNewClient({ name: '', slug: '', formId: '' }) // Reset form
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Cargando clientes...</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )
    }

    return (
      <>
        <div className="flex justify-between items-center mb-8">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default">
                <PlusCircle className="mr-2 h-4 w-4" />
                Crear nuevo dashboard
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear nuevo dashboard</DialogTitle>
              </DialogHeader>
              <DashboardForm 
                onSubmit={handleSubmit}
                newClient={newClient}
                setNewClient={setNewClient}
              />
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Lista de Dashboards Existentes */}
        <div className="mb-12">
          <div className="grid gap-4">
            {clients.map((client) => (
              <Card key={client.id}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{client.name}</h3>
                    <p className="text-sm text-gray-600">Slug: {client.slug}</p>
                    <p className="text-sm text-gray-600">Form ID: {client.formId}</p>
                  </div>
                  <Button asChild variant="outline">
                    <Link href={`/${client.slug}`}>
                      Ir a dashboard
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboards de Cima</h1>
      {renderContent()}
    </div>
  )
}
