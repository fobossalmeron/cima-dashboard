import { KPICard } from "@/components/kpi-general/kpi-card"
import { ActivationSalesChart } from "@/components/kpi-general/activation-sales-chart"
import { HeatMap } from "@/components/kpi-general/heat-map"

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">KPIs Generales</h1>

      {/* Mapa de calor */}
      <div className="w-full">
        <HeatMap />
      </div>

      {/* Indicadores KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total de activaciones" value="120" />
        <KPICard title="Locaciones visitadas" value="85" />
        <KPICard title="Muestras entregadas" value="5,000" />
        <KPICard title="Unidades vendidas" value="2,500" />
        <KPICard title="Conversión" value="50%" />
        <KPICard title="Velocity" value="25" suffix="por hora" />
        <KPICard title="NPS" value="8.5" />
        <KPICard title="Followings" value="1,200" />
      </div>

      {/* Gráfico de ventas y activaciones */}
      <div className="w-full">
        <ActivationSalesChart />
      </div>
    </div>
  )
}

