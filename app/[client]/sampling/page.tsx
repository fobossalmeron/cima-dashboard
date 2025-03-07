import { Header } from "@/components/header";
import { Content } from "@/components/content";
import { TrafficDuringActivationChart } from "@/components/sampling/traffic-during-activation-chart";
import { ActivationHoursHeatmap } from "@/components/sampling/activation-hours-heatmap";
import { ActivationsHistoryTable } from "@/components/sampling/activations-history-table";
import { PromoterImages } from "@/components/sampling/promoter-images";
import {
  PromoterImageData,
  HeatmapDataStructure,
} from "@/components/sampling/sampling.types";
import { ActivationsHistoryDummy } from "@/components/sampling/activations-history-table-dummy";
import { TrafficDuringActivationChartData } from "@/components/sampling/sampling.types";

/**
 * VELOCITY POR HORA
 *
 * Información importante:
 * - Cada activación dura 4 horas (estándar de la industria)
 * - El cálculo de velocity por hora:
 *   - Se asigna el mismo velocity de la activación a las 4 horas que dura
 *   - Con el tiempo, las horas se irán empalmando (ej: activaciones que comienzan
 *     a las 2pm, 3pm, 4pm) lo que hará que los datos sean más precisos
 */

const ActivationHoursHeatmapDummy: HeatmapDataStructure = {
  Lunes: {
    6: 0,
    7: 15,
    8: 30,
    9: 60,
    10: 75,
    11: 85,
    12: 90,
    13: 80,
    14: 50,
    15: 70,
    16: 65,
    17: 55,
    18: 40,
  },
  Martes: {
    6: 15,
    7: 25,
    8: 45,
    9: 75,
    10: 85,
    11: 95,
    12: 100,
    13: 90,
    14: 60,
    15: 80,
    16: 75,
    17: 65,
    18: 45,
  },
  Miércoles: {
    6: 15,
    7: 25,
    8: 45,
    9: 75,
    10: 85,
    11: 90,
    12: 85,
    13: 80,
    14: 60,
    15: 70,
    16: 65,
    17: 55,
    18: 40,
  },
  Jueves: {
    6: 15,
    7: 25,
    8: 45,
    9: 75,
    10: 85,
    11: 90,
    12: 85,
    13: 80,
    14: 60,
    15: 70,
    16: 75,
    17: 85,
    18: 90,
  },
  Viernes: {
    6: 15,
    7: 25,
    8: 45,
    9: 75,
    10: 85,
    11: 90,
    12: 85,
    13: 80,
    14: 60,
    15: 70,
    16: 65,
    17: 55,
    18: 0,
  },
  Sábado: {
    6: 0,
    7: 0,
    8: 13,
    9: 75,
    10: 85,
    11: 90,
    12: 85,
    13: 80,
    14: 60,
    15: 70,
    16: 65,
    17: 55,
    18: 40,
  },
  Domingo: {
    6: 15,
    7: 25,
    8: 45,
    9: 75,
    10: 85,
    11: 90,
    12: 85,
    13: 80,
    14: 60,
    15: 70,
    16: 65,
    17: 55,
    18: 40,
  },
};

const TrafficDuringActivationChartDummy: TrafficDuringActivationChartData[] = [
  { range: "Medio", value: 37 },
  { range: "Bajo", value: 18 },
  { range: "Muy Bajo", value: 8 },
  { range: "Alto", value: 23 },
  { range: "Muy Alto", value: 15 },
];

const PromoterImagesDummy: PromoterImageData[] = [
  {
    url: "/placeholder.svg",
    name: "Andrea Velazquez",
  },
  {
    url: "/placeholder.svg",
    name: "María Pérez",
  },
  {
    url: "/placeholder.svg",
    name: "Roberta García",
  },
];

export default function Sampling() {
  return (
    <div className="space-y-6">
      <Header title="Sampling" />
      <Content>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TrafficDuringActivationChart
            data={TrafficDuringActivationChartDummy}
          />
          <div className="md:col-span-2 lg:col-span-2">
            <PromoterImages data={PromoterImagesDummy} />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <ActivationHoursHeatmap data={ActivationHoursHeatmapDummy} />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <ActivationsHistoryTable data={ActivationsHistoryDummy} />
          </div>
        </div>
      </Content>
    </div>
  );
}
