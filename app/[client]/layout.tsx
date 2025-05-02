import { ReactNode } from 'react'
import { ClientProvider } from '@/lib/context/ClientContext'
import { notFound } from 'next/navigation'
import { ClientsService } from '@/lib/services'
import { GiveawayProductsTypesService } from '@/lib/services/db/giveaway-products-types.service'
import { CatalogProvider } from '@/lib/context/CatalogContext'

export default async function ClientLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ client: string }>
}) {
  const resolvedParams = await params
  const clientData = await ClientsService.getBySlug(resolvedParams.client)

  if (!clientData || !clientData.dashboard) {
    notFound()
    return null
  }

  const giveawayProductTypes =
    await GiveawayProductsTypesService.getGiveawayProductTypeByDashboardId(
      clientData.dashboard.id,
    )

  const dashboardData = clientData.dashboard

  if (!dashboardData) {
    notFound()
    return null
  }

  return (
    <ClientProvider clientData={clientData} dashboardData={dashboardData}>
      <CatalogProvider giveawayProductTypes={giveawayProductTypes}>
        {children}
      </CatalogProvider>
    </ClientProvider>
  )
}
