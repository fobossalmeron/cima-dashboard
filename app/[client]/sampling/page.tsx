'use client'

import { Header } from '@/components/header'
import { Content } from '@/components/content'
import { TrafficDuringActivationChart } from '@/components/sampling/traffic-during-activation-chart'
import { ActivationHoursHeatmap } from '@/components/sampling/activation-hours-heatmap'
import { ActivationsHistoryTable } from '@/components/sampling/activations-history-table'
import { PromoterImages } from '@/components/sampling/promoter-images'
import {
  getActivationsHistory,
  getHeatmapData,
  getPromoterImagesData,
  getTrafficDuringActivationChartData,
} from '@/lib/utils/dashboard-data/samplings'
import { useClientContext } from '@/lib/context/ClientContext'

/**
 * VELOCITY POR HORA
 *
 * Información importante:
 * - Cada activación dura 4 horas (estándar de la industria)
 * - El cálculo de velocity por hora:
 *   - Se asigna el mismo velocity de la activación a las 4 horas que dura
 *   - Con el tiempo, las horas se irán empalmando (ej: activaciones que comienzan
 *     a las 2pm, 3pm, 4pm) lo que hará que los datos sean más precisos
 */

export default function Sampling() {
  const { dashboardData } = useClientContext()

  if (!dashboardData) {
    return <div>No dashboard data found</div>
  }

  const activationsHistory = getActivationsHistory(dashboardData)
  const trafficDuringActivationChartData =
    getTrafficDuringActivationChartData(dashboardData)
  const promoterImagesData = getPromoterImagesData(dashboardData)
  const heatmapData = getHeatmapData(dashboardData)
  return (
    <div className="space-y-6">
      <Header title="Sampling" />
      <Content>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 print:grid-cols-3 gap-6">
          <div className="lg:col-span-1 md:col-span-2">
            <TrafficDuringActivationChart
              data={trafficDuringActivationChartData}
            />
          </div>
          <div className="md:col-span-2 lg:col-span-2 print:col-span-2">
            <PromoterImages data={promoterImagesData} />
          </div>
          <div className="md:col-span-2 lg:col-span-3 print:col-span-3">
            <ActivationHoursHeatmap data={heatmapData} />
          </div>
          <div className="md:col-span-2 lg:col-span-3 print:col-span-3">
            <ActivationsHistoryTable data={activationsHistory} />
          </div>
        </div>
      </Content>
    </div>
  )
}
