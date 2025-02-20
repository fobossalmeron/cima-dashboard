import { KPICard } from "@/components/kpi-general/kpi-card";
import { ActivationSalesChart } from "@/components/kpi-general/activation-sales-chart";
import { HeatMap } from "@/components/kpi-general/heat-map";
import { Header } from "@/components/header";
import { Content } from "@/components/content";
import {
  Zap,
  MapPin,
  Package,
  ShoppingCart,
  PercentCircle,
  Timer,
  Star,
  Users,
} from "lucide-react";

export default function Home() {
  return (
    <div>
      <Header title="KPIs Generales" />

      <Content>
        {/* Mapa de calor */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-[67%_31%] gap-8">
          {/* Mapa de calor */}
          <HeatMap />
          {/* Indicadores KPI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <KPICard title="Activaciones" value="120" icon={Zap} />
            <KPICard title="Locaciones visitadas" value="85" icon={MapPin} />
            <KPICard title="Muestras entregadas" value="5,000" icon={Package} />
            <KPICard
              title="Unidades vendidas"
              value="2,500"
              icon={ShoppingCart}
            />
            <KPICard title="Conversión" value="50%" icon={PercentCircle} />
            <KPICard title="Velocity" value="12.5" icon={Timer} />
            <KPICard title="NPS" value="8.6" icon={Star} />
            <KPICard title="Followings en RRSS" value="32" icon={Users} />
          </div>
        </div>

        {/* Gráfico de ventas y activaciones */}
        <div className="w-full">
          <ActivationSalesChart />
        </div>
      </Content>
    </div>
  );
}
