'use client'

import { createContext, useContext, ReactNode, useState } from 'react'
import { Client } from '@prisma/client'
import { DashboardWithRelations } from '@/types/prisma'
import { DashboardFilters } from '@/types/services'

interface ClientContextType {
  clientData: Client
  dashboardData: DashboardWithRelations | null
  setDashboardData: (data: DashboardWithRelations | null) => void
  filters: DashboardFilters | undefined
  setFilters: (filters: DashboardFilters | undefined) => void
}

const ClientContext = createContext<ClientContextType | undefined>(undefined)

export function ClientProvider({
  children,
  clientData,
  dashboardData: initialDashboardData,
}: {
  children: ReactNode
  clientData: Client
  dashboardData: DashboardWithRelations
}) {
  const [dashboardData, setDashboardData] =
    useState<DashboardWithRelations | null>(initialDashboardData)
  const [filters, setFilters] = useState<DashboardFilters | undefined>(
    undefined,
  )

  return (
    <ClientContext.Provider
      value={{
        clientData,
        dashboardData,
        setDashboardData,
        filters,
        setFilters,
      }}
    >
      {children}
    </ClientContext.Provider>
  )
}

export function useClientContext() {
  const context = useContext(ClientContext)
  if (context === undefined) {
    throw new Error('useClientContext must be used within a ClientProvider')
  }
  return context
}
