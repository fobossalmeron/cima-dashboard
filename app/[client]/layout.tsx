import { ReactNode } from 'react'
import { ClientProvider } from '@/lib/context/ClientContext'
import { notFound } from 'next/navigation'
import { ClientsService } from '@/lib/services'

export default async function ClientLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ client: string }>
}) {
  const resolvedParams = await params
  const clientData = await ClientsService.getBySlug(resolvedParams.client)

  if (!clientData) {
    notFound()
    return null
  }

  const dashboardData = clientData.dashboard

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
