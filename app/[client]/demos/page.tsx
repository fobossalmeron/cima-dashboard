'use client'

import { Header } from '@/components/header'
import { Content } from '@/components/content'
import { TrafficDuringActivationChart } from '@/components/sampling/traffic-during-activation-chart'
import { ActivationHoursHeatmap } from '@/components/sampling/activation-hours-heatmap'
import { ActivationsHistoryTable } from '@/components/sampling/activations-history-table'
import { OldAndNewActivationsChart } from '@/components/sampling/old-and-new-activations-chart'
import { PromoterImages } from '@/components/sampling/promoter-images'
import { Giveaways } from '@/components/sampling/giveaways'
import { PDVCoolerChart } from '@/components/sampling/pdv-cooler-chart'
import { CoolerSalesChart } from '@/components/sampling/cooler-sales-chart'
import { CoolerTypesChart } from '@/components/sampling/cooler-types-chart'
import { CoolerImages } from '@/components/sampling/cooler-images'
import { PDVPOPChart } from '@/components/sampling/pdv-pop-chart'
import { POPTypesChart } from '@/components/sampling/pop-types-chart'
import { POPImages } from '@/components/sampling/pop-images'
import {
  getActivationsHistory,
  getGiveawayProductsData,
  getHeatmapData,
  getPromoterImagesData,
  getTrafficDuringActivationChartData,
} from '@/lib/utils/dashboard-data/samplings'
import {
  getCoolerData,
  getCoolerSalesData,
  getCoolersImagesData,
  getCoolerTypesData,
  getOldAndNewActivationsChartData,
  getPopData,
  getPopTypesData,
  getPopsImagesData,
} from '@/lib/utils/dashboard-data/products'
import { useClientContext } from '@/lib/context/ClientContext'
import { useCatalogContext } from '@/lib/context/CatalogContext'
import {
  CoolerData,
  CoolerImageData,
  CoolerSalesData,
  CoolerTypesData,
  PopData,
  PopTypesRecord,
} from '@/components/product/product.types'

/**
 * VELOCITY POR HORA
 *
 * Información importante:
 * - Cada demo dura 4 horas (estándar de la industria)
 * - El cálculo de velocity por hora:
 *   - Se asigna el mismo velocity de la demo a las 4 horas que dura
 *   - Con el tiempo, las horas se irán empalmando (ej: demos que comienzan
 *     a las 2pm, 3pm, 4pm) lo que hará que los datos sean más precisos
 */

export default function Demos() {
  const { dashboardData } = useClientContext()
  const { giveawayProductTypes } = useCatalogContext()

  if (!dashboardData) {
    return <div>No se encontró información del dashboard</div>
  }

  const activationsHistory = getActivationsHistory(dashboardData)
  const trafficDuringActivationChartData =
    getTrafficDuringActivationChartData(dashboardData)
  const promoterImagesData = getPromoterImagesData(dashboardData)
  const heatmapData = getHeatmapData(dashboardData)
  const giveawaysData = getGiveawayProductsData(
    dashboardData,
    giveawayProductTypes,
  )
  const oldAndNewActivationsChartData =
    getOldAndNewActivationsChartData(dashboardData)

  // Datos de ejemplo para el gráfico de cooler (reemplazar con datos reales cuando estén disponibles)
  const coolerData: CoolerData = getCoolerData(dashboardData)

  // Datos de ejemplo para el gráfico de ventas por cooler (reemplazar con datos reales cuando estén disponibles)
  const coolerSalesData: CoolerSalesData = getCoolerSalesData(dashboardData)

  // Datos de ejemplo para el gráfico de tipos de cooler (reemplazar con datos reales cuando estén disponibles)
  const coolerTypesData: CoolerTypesData[] = getCoolerTypesData(dashboardData)

  // Datos de ejemplo para las imágenes de coolers (reemplazar con datos reales cuando estén disponibles)
  const coolerImagesData: CoolerImageData[] =
    getCoolersImagesData(dashboardData)

  // Datos de ejemplo para el gráfico de POP (reemplazar con datos reales cuando estén disponibles)
  const popData: PopData = getPopData(dashboardData)

  // Datos de ejemplo para el gráfico de tipos de POP (reemplazar con datos reales cuando estén disponibles)
  const popTypesData: PopTypesRecord[] = getPopTypesData(dashboardData)

  // Datos de ejemplo para las imágenes de POP (reemplazar con datos reales cuando estén disponibles)
  const popImagesData: CoolerImageData[] = getPopsImagesData(dashboardData)

  return (
    <div className="space-y-6">
      <Header title="Demos" />
      <Content>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 print:grid-cols-3 gap-6">
          <div className="lg:col-span-1 md:col-span-2">
            <TrafficDuringActivationChart
              data={trafficDuringActivationChartData}
            />
          </div>
          <OldAndNewActivationsChart data={oldAndNewActivationsChartData} />
          <div className="md:col-span-2 lg:col-span-3 print:col-span-3">
            <PromoterImages data={promoterImagesData} />
          </div>
          <div className="md:col-span-2 lg:col-span-2 print:col-span-2">
            <ActivationHoursHeatmap data={heatmapData} />
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-1 print:col-span-1">
            <Giveaways data={giveawaysData} />
          </div>
          <div className="md:col-span-2 lg:col-span-3 print:col-span-3">
            <ActivationsHistoryTable data={activationsHistory} />
          </div>
          <PDVCoolerChart data={coolerData} />
          <CoolerTypesChart data={coolerTypesData} />
          <div className="md:col-span-2 lg:col-span-2 print:col-span-3">
            <CoolerImages data={coolerImagesData} />
          </div>
          <CoolerSalesChart data={coolerSalesData} />
          <PDVPOPChart data={popData} />
          <POPTypesChart data={popTypesData} />
          <div className="md:col-span-2 lg:col-span-2 print:col-span-3">
            <POPImages data={popImagesData} />
          </div>
        </div>
      </Content>
    </div>
  )
}
