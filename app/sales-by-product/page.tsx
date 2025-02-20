"use client"

import { ProductSalesChart } from "@/components/product-sales/product-sales-chart"
import { ProductSalesEvolutionChart } from "@/components/product-sales/product-sales-evolution-chart"
import { ProductSalesByStoreChart } from "@/components/product-sales/product-sales-by-store-chart"
import { ProductAveragePriceChart } from "@/components/product-sales/product-average-price-chart"
import { ProductSalesVsTargetChart } from "@/components/product-sales/product-sales-vs-target-chart"
import { Header } from "@/components/header"

export default function ProductSales() {
  return (
    <div className="space-y-6">
      <Header title="Ventas por Producto" />
      <h1 className="text-3xl font-bold mb-6">Indicadores de ventas por producto</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <ProductSalesChart />
        </div>
        <div className="md:col-span-2">
          <ProductSalesEvolutionChart />
        </div>
        <div className="md:col-span-2">
          <ProductSalesByStoreChart />
        </div>
        <ProductAveragePriceChart />
        <ProductSalesVsTargetChart />
      </div>
    </div>
  )
}

