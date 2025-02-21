"use client"

import { ProductSalesChart } from "@/components/product-sales/product-sales-chart"
import { Header } from "@/components/header"
import { Content } from "@/components/content"
import { delFrutalLatas, delFrutalAguasFrescas } from "@/data/brands"
import { TotalSalesByBrand } from "@/components/sales/total-sales-by-brand-chart"
export default function ProductSales() {
  return (
    <div className="space-y-6">
      <Header title="Ventas por producto" />
      <Content>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="md:col-span-3">
          <TotalSalesByBrand />
        </div>
            <ProductSalesChart title="Del Frutal Nectar" data={delFrutalLatas} />
            <ProductSalesChart title="Del Frutal Aguas Frescas" data={delFrutalAguasFrescas} />

            <ProductSalesChart title="Del Frutal Nectar" data={delFrutalLatas} />
          
        </div>
      </Content>
    </div>
  )
}

