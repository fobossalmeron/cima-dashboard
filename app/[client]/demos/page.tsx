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
import { CoolerSizesChart } from '@/components/sampling/cooler-sizes-chart'
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
import { getOldAndNewActivationsChartData } from '@/lib/utils/dashboard-data/products'
import { useClientContext } from '@/lib/context/ClientContext'
import { useCatalogContext } from '@/lib/context/CatalogContext'

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
  const coolerData = [
    { type: 'Con cooler' as const, quantity: 45 },
    { type: 'Sin cooler' as const, quantity: 23 },
  ]

  // Datos de ejemplo para el gráfico de ventas por cooler (reemplazar con datos reales cuando estén disponibles)
  const coolerSalesData = [
    { type: 'Con cooler' as const, ventas: 125000 },
    { type: 'Sin cooler' as const, ventas: 87500 },
  ]

  // Datos de ejemplo para el gráfico de tamaños de cooler (reemplazar con datos reales cuando estén disponibles)
  const coolerSizesData = [
    { size: 'Grande', quantity: 28 },
    { size: 'Pequeño', quantity: 12 },
  ]

  // Datos de ejemplo para las imágenes de coolers (reemplazar con datos reales cuando estén disponibles)
  const coolerImagesData = [
    {
      url: '/assets/dummy/pdv1.jpg',
      name: 'Cooler Vertical - Supermercado Central',
    },
    {
      url: '/assets/dummy/pdv2.jpg',
      name: 'Cooler Horizontal - Tienda Express',
    },
    {
      url: '/assets/dummy/pdv3.jpg',
      name: 'Cooler Portátil - Evento Especial',
    },
    {
      url: '/assets/dummy/pdv4.jpg',
      name: 'Cooler de Mesa - Oficina',
    },
  ]

  // Datos de ejemplo para el gráfico de POP (reemplazar con datos reales cuando estén disponibles)
  const popData = [
    { type: 'Con POP' as const, quantity: 32 },
    { type: 'Sin POP' as const, quantity: 36 },
  ]

  // Datos de ejemplo para el gráfico de tipos de POP (reemplazar con datos reales cuando estén disponibles)
  const popTypesData = [
    { type: 'Cintillo', quantity: 18 },
    { type: 'Dangler', quantity: 12 },
    { type: 'Preciador', quantity: 8 },
    { type: 'Cooler Sticker', quantity: 7 },
    { type: 'Poster', quantity: 6 },
    { type: 'Pallet Wrap', quantity: 5 },
    { type: 'Cabezote', quantity: 4 },
  ]

  // Datos de ejemplo para las imágenes de POP (reemplazar con datos reales cuando estén disponibles)
  const popImagesData = [
    {
      url: '/assets/dummy/pdv1.jpg',
      name: 'Cintillo promocional - Supermercado Central',
    },
    {
      url: '/assets/dummy/pdv2.jpg',
      name: 'Dangler de producto - Tienda Express',
    },
    {
      url: '/assets/dummy/pdv3.jpg',
      name: 'Preciador especial - Evento Promocional',
    },
    {
      url: '/assets/dummy/pdv4.jpg',
      name: 'Banner de marca - Punto de venta',
    },
  ]

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
          <CoolerSizesChart data={coolerSizesData} />
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
