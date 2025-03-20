'use client'

import { Header } from '@/components/header'
import { Content } from '@/components/content'
import { SalesByAmbassadorChart } from '@/components/ambassadors/sales-by-ambassador-chart'
import { AmbassadorsTable } from '@/components/ambassadors/ambassadors-table'
import { ActivationsVsSalesChart } from '@/components/ambassadors/activations-vs-sales-chart'
import { useClientContext } from '@/lib/context/ClientContext'
import { getAmbassadorsData } from '@/lib/utils/dashboard-data/ambassadors'

export default function BrandAmbassadors() {
  const { dashboardData } = useClientContext()

  if (!dashboardData) {
    return <div>No dashboard data found</div>
  }

  const ambassadorsData = getAmbassadorsData(dashboardData)

  return (
    <div>
      <Header title="Embajadoras de marca" />
      <Content>
        <div className="grid grid-cols-1 lg:grid-cols-2 print:grid-cols-2 gap-6">
          <SalesByAmbassadorChart data={ambassadorsData} />
          <AmbassadorsTable data={ambassadorsData} />
        </div>
        <ActivationsVsSalesChart data={ambassadorsData} />
      </Content>
    </div>
  )
}
