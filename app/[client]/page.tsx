'use client'

import { Header } from '@/components/header'
import { Content } from '@/components/content'
import { ActivationSalesChart } from '@/components/general/activation-sales-chart'
import { Maps } from '@/components/general/maps/maps'
import { Kpis } from '@/components/general/kpis'
import { useClientContext } from '@/lib/context/ClientContext'
import { getChartData } from '@/lib/utils/dashboard-data/activations'
import { getMapsData } from '@/lib/utils/dashboard-data/maps'
import { getKpisData } from '@/lib/utils/dashboard-data/kpis'

export default function ClientDashboard() {
  const { dashboardData } = useClientContext()

  if (!dashboardData) {
    return <div>No dashboard data found</div>
  }

  const chartData = getChartData(dashboardData)
  const mapsData = getMapsData(dashboardData)
  const kpisData = getKpisData(dashboardData)

  return (
    <div>
      <Header title={'KPIs Generales'} />
      <Content>
        <div className="w-full grid grid-cols-1 lg:grid-cols-[67%_31%] print:grid-cols-[67%_31%] gap-8">
          <Maps data={mapsData} />
          <Kpis data={kpisData} />
          <div className="col-span-1 lg:col-span-2 print:col-span-2">
            <ActivationSalesChart data={chartData} />
          </div>
        </div>
      </Content>
    </div>
  )
}
