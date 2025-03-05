import { KPICard } from "./kpi-card";
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
import { KpisData } from "./general.types";

/**
 * Componente que muestra un conjunto de tarjetas KPI con métricas clave.
 *
 * @param {KpisData} props.data
 * @property {number} activations - Número de activaciones
 * @property {number} locationsVisited - Número de locaciones visitadas
 * @property {number} samplesDelivered - Número de muestras entregadas
 * @property {number} unitsSold - Número de productos vendidos
 * @property {number} conversion - Porcentaje de conversión (se contactan 4 personas, te compran 2, 50% de conversión)
 * @property {number} velocity - Velocidad de venta (número de ventas por activación / 4 horas nos da el velocity de una activación, este debe ser el promedio de todos los velocitys)
 * @property {number} nps - Net Promoter Score (en el componente /components/consumer/nps-chart.tsx está el mecanismo para sacarlo)
 * @property {number} followings - Número de seguidores en RRSS
 */

export function Kpis({ data }: { data: KpisData }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <KPICard
        title="Activaciones"
        value={data.activations.toString()}
        icon={Zap}
      />
      <KPICard
        title="Locaciones visitadas"
        value={data.locationsVisited.toString()}
        icon={MapPin}
      />
      <KPICard
        title="Muestras entregadas"
        value={data.samplesDelivered.toString()}
        icon={Package}
      />
      <KPICard
        title="Unidades vendidas"
        value={data.unitsSold.toString()}
        icon={ShoppingCart}
      />
      <KPICard
        title="Conversión"
        value={data.conversion.toString()}
        icon={PercentCircle}
        colorRanges={{
          green: [75, 100],
          yellow: [50, 75],
          red: [0, 50],
        }}
      />
      <KPICard
        title="Velocity"
        value={data.velocity.toString()}
        icon={Timer}
        colorRanges={{
          green: [8, 11],
          yellow: [5, 8],
          red: [0, 5],
        }}
      />
      <KPICard title="NPS" value={data.nps.toString()} icon={Star} />
      <KPICard
        title="Followings en RRSS"
        value={data.followings.toString()}
        icon={Users}
      />
    </div>
  );
}
