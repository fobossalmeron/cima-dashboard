'use client'

import { Header } from '@/components/header'
import { Content } from '@/components/content'
import { TotalSalesByBrand } from '@/components/sales/total-sales-by-brand-chart'
import { ProductSalesTable } from '@/components/sales/product-sales-table'
import {
  groupedProductsByBrand,
  salesBySubBrand,
} from '@/lib/utils/dashboard-data/sales'
import { useClientContext } from '@/lib/context/ClientContext'

export default function Sales() {
  const { dashboardData } = useClientContext()

  if (!dashboardData) {
    return <div>No dashboard data found</div>
  }

  const totalSalesBySubBrand = salesBySubBrand(dashboardData)
  const groupedProducts = groupedProductsByBrand(dashboardData)

  return (
    <div className="space-y-6">
      <Header title="Ventas" />
      <Content>
        <div className="w-full">
          <TotalSalesByBrand data={totalSalesBySubBrand} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 print:grid-cols-3 gap-6">
          {Object.entries(groupedProducts).flatMap(([brand, subBrands]) =>
            Object.entries(subBrands).map(([subBrand, products]) => {
              const subBrandName = subBrand.includes('Not specified')
                ? subBrand.replace('Not specified', '').trim()
                : ` ${subBrand}`
              return (
                <ProductSalesTable
                  key={`${brand}-${subBrand}`}
                  title={`${brand}${subBrandName}`}
                  data={products}
                />
              )
            }),
          )}
        </div>
      </Content>
    </div>
  )
}
