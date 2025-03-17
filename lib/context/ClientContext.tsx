'use client'

import { createContext, useContext, ReactNode } from 'react'
import { Client, Dashboard } from '@prisma/client'

// Define la interfaz para el contexto, incluyendo clientName, formID, y un objeto data
interface ClientContextType {
  clientData: Client
  dashboardData: Dashboard
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
  dashboardData: Dashboard
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
