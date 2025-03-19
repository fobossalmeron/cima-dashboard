'use client'

import { createContext, useContext, ReactNode } from 'react'
import { Client } from '@prisma/client'
import { DashboardWithRelations } from '@/types/api/clients'

// Define la interfaz para el contexto, incluyendo clientName, formID, y un objeto data
interface ClientContextType {
  clientData: Client
  dashboardData: DashboardWithRelations
}

// Crea el contexto con un valor inicial indefinido
const ClientContext = createContext<ClientContextType | undefined>(undefined)

// Define el proveedor del contexto, aceptando un objeto con todos los datos
export const ClientProvider = ({
  children,
  clientData,
  dashboardData,
}: {
  children: ReactNode
  clientData: Client
  dashboardData: DashboardWithRelations
}) => {
  return (
    <ClientContext.Provider value={{ clientData, dashboardData }}>
      {children}
    </ClientContext.Provider>
  )
}

// Hook para usar el contexto
export const useClient = () => {
  const context = useContext(ClientContext)
  if (!context) {
    throw new Error('useClient must be used within a ClientProvider')
  }
  return context
}
