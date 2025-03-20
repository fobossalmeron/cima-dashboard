'use client'

import { PDVTypeChart } from '@/components/product/pdv-type-chart'
import { ProductLocationInPDVChart } from '@/components/product/product-location-in-pdv-chart'
import { ProductStatusInPDVChart } from '@/components/product/product-status-in-pdv-chart'
import { AveragePriceInPDVChart } from '@/components/product/average-price-in-pdv-chart'
import { OldAndNewActivationsChart } from '@/components/product/old-and-new-activations-chart'
import { PDVProductImages } from '@/components/product/pdv-product-images'
import { Header } from '@/components/header'
import { Content } from '@/components/content'
import { useClientContext } from '@/lib/context/ClientContext'
import {
  getPDVTypeData,
  getProductLocationData,
  getAveragePriceData,
  getProductStatusInPDVChartData,
} from '@/lib/utils/dashboard-data/products'

const OldAndNewActivationsChartDummy = [
  {
    month: 'Enero',
    new_location_activations: 45,
    previous_location_activations: 30,
    new_locations: 15,
    previous_locations: 10,
  },
  {
    month: 'Febrero',
    new_location_activations: 60,
    previous_location_activations: 40,
    new_locations: 20,
    previous_locations: 15,
  },
  {
    month: 'Marzo',
    new_location_activations: 95,
    previous_location_activations: 50,
    new_locations: 45,
    previous_locations: 20,
  },
  {
    month: 'Abril',
    new_location_activations: 90,
    previous_location_activations: 60,
    new_locations: 30,
    previous_locations: 25,
  },
  {
    month: 'Mayo',
    new_location_activations: 55,
    previous_location_activations: 70,
    new_locations: 15,
    previous_locations: 30,
  },
  {
    month: 'Junio',
    new_location_activations: 120,
    previous_location_activations: 80,
    new_locations: 20,
    previous_locations: 35,
  },
]

const PDVProductImagesDummy = [
  {
    locationName: 'Food Star',
    address: "5521 Leesburg Pike, 22041, Bailey's Crossroads, Virginia",
    url: '/assets/dummy/pdv1.jpg',
  },
  {
    locationName: 'Stamford Market',
    address: '123 Broad St, 06901, Stamford, Connecticut',
    url: '/assets/dummy/pdv2.jpg',
  },
  {
    locationName: 'Greenwich Grocer',
    address: '456 E Putnam Ave, 06830, Greenwich, Connecticut',
    url: '/assets/dummy/pdv3.jpg',
  },
  {
    locationName: 'Norwalk Mart',
    address: '789 Main Ave, 06851, Norwalk, Connecticut',
    url: '/assets/dummy/pdv4.jpg',
  },
  {
    locationName: 'Stamford Market',
    address: '123 Broad St, 06901, Stamford, Connecticut',
    url: '/assets/dummy/pdv5.jpg',
  },
]

export default function ProductInfo() {
  const { dashboardData } = useClientContext()

  if (!dashboardData) {
    return <div>No dashboard data found</div>
  }

  const pdvTypeData = getPDVTypeData(dashboardData)
  const productLocationData = getProductLocationData(dashboardData)
  const averagePriceData = getAveragePriceData(dashboardData)
  const productStatusInPDVChartData =
    getProductStatusInPDVChartData(dashboardData)

  return (
    <div className="space-y-6">
      <Header title="Información del producto" />
      <Content>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 print:grid-cols-3 gap-6">
          <PDVTypeChart data={pdvTypeData} />
          <ProductLocationInPDVChart data={productLocationData} />
          <ProductStatusInPDVChart data={productStatusInPDVChartData} />
          <AveragePriceInPDVChart data={averagePriceData} />
          <OldAndNewActivationsChart data={OldAndNewActivationsChartDummy} />
          <PDVProductImages data={PDVProductImagesDummy} />
        </div>
      </Content>
    </div>
  )
}
