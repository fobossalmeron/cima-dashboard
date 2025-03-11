'use client'

import { Header } from '@/components/header'
import { Content } from '@/components/content'
import { products } from '@/data/brands'
import { TotalSalesByBrand } from '@/components/sales/total-sales-by-brand-chart'
import { ProductSalesTable } from '@/components/sales/product-sales-table'
import { TotalSalesByBrandData } from '@/components/sales/sales.types'

const TotalSalesByBrandDummy: TotalSalesByBrandData[] = [
  { brand: 'Del Frutal Aguas Frescas', quantity: 5100 },
  { brand: 'Del Frutal Néctares', quantity: 2600 },
  { brand: 'Del Frutal Pulpa', quantity: 4300 },
  { brand: 'Raptor Energy Drink', quantity: 1000 },
  { brand: 'Naturas Néctares', quantity: 1000 },
  { brand: 'Naturas Pulpa', quantity: 1000 },
]

type ProductsByBrand = {
  [key: string]: {
    [key: string]: typeof products
  }
}

export default function Sales() {
  const groupedProducts = products.reduce<ProductsByBrand>((acc, product) => {
    const brand = product.brand
    const subBrand = product.subBrand

    if (!acc[brand]) {
      acc[brand] = {}
    }
    if (!acc[brand][subBrand]) {
      acc[brand][subBrand] = []
    }
    acc[brand][subBrand].push(product)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <Header title="Ventas" />
      <Content>
        <div className="w-full">
          <TotalSalesByBrand data={TotalSalesByBrandDummy} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 print:grid-cols-3 gap-6">
          {Object.entries(groupedProducts).flatMap(([brand, subBrands]) =>
            Object.entries(subBrands).map(([subBrand, products]) => (
              <ProductSalesTable
                key={`${brand}-${subBrand}`}
                title={subBrand}
                data={products}
              />
            )),
          )}
        </div>
      </Content>
    </div>
  )
}
