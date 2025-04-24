'use client'

import { PDVTypeChart } from '@/components/product/pdv-type-chart'
import { ProductLocationInPDVChart } from '@/components/product/product-location-in-pdv-chart'
import { ProductStatusInPDVChart } from '@/components/product/product-status-in-pdv-chart'
import { AveragePriceInPDVChart } from '@/components/product/average-price-in-pdv-chart'
import { PDVProductImages } from '@/components/product/pdv-product-images'
import { Header } from '@/components/header'
import { Content } from '@/components/content'
import { useClientContext } from '@/lib/context/ClientContext'
import {
  getPDVTypeData,
  getProductLocationData,
  getAveragePriceData,
  getProductStatusInPDVChartData,
  getPDVProductImages,
} from '@/lib/utils/dashboard-data/products'

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
  const pdvProductImages = getPDVProductImages(dashboardData)

  return (
    <div className="space-y-6">
      <Header title="Información del producto" />
      <Content>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 print:grid-cols-3 gap-6">
          <PDVTypeChart data={pdvTypeData} />
          <ProductLocationInPDVChart data={productLocationData} />
          <ProductStatusInPDVChart data={productStatusInPDVChartData} />
          <AveragePriceInPDVChart data={averagePriceData} />
          <PDVProductImages data={pdvProductImages} />
        </div>
      </Content>
    </div>
  )
}
