import { TotalSalesChart } from "@/components/sales-indicators/total-sales-chart"
import { SalesByStoreTypeChart } from "@/components/sales-indicators/sales-by-store-type-chart"
import { TopStoresChart } from "@/components/sales-indicators/top-stores-chart"
import { SalesByDayChart } from "@/components/sales-indicators/sales-by-day-chart"
import { SalesByHourChart } from "@/components/sales-indicators/sales-by-hour-chart"
import { SalesVsTargetChart } from "@/components/sales-indicators/sales-vs-target-chart"
import { Header } from "@/components/header"

export default function SalesIndicators() {
  return (
    <div className="space-y-6">

      <Header title="Ventas" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <TotalSalesChart />
        </div>
        <SalesByStoreTypeChart />
        <TopStoresChart />
        <SalesByDayChart />
        <SalesByHourChart />
        <div className="md:col-span-2">
          <SalesVsTargetChart />
        </div>
      </div>
    </div>
  )
}

