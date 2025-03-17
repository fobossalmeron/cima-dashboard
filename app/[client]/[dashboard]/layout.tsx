import { ReactNode } from 'react'
import { ClientProvider } from '@/lib/context/ClientContext'
import { notFound } from 'next/navigation'
import { ClientsService, DashboardsService } from '@/lib/services/db'

export default async function ClientLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ client: string; dashboard: string }>
}) {
  const resolvedParams = await params
  const clientData = await ClientsService.getById(resolvedParams.client)

  if (!clientData) {
    notFound()
    return null
  }

  const dashboardData = await DashboardsService.getById(
    resolvedParams.dashboard,
  )

  if (!dashboardData) {
    notFound()
    return null
  }

  return (
    <ClientProvider clientData={clientData} dashboardData={dashboardData}>
      {children}
    </ClientProvider>
  )
}
