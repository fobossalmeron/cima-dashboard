import { Header } from "@/components/header";
import { Content } from "@/components/content";
import { TrafficDuringActivationChart } from "@/components/sampling/traffic-during-activation-chart";
import { ActivationHoursHeatmap } from "@/components/sampling/activation-hours-heatmap";
import { ActivationsHistoryTable } from "@/components/sampling/activations-history-table";
import { PromoterImages } from "@/components/sampling/promoter-images";
import { PromoterImageData } from "@/components/sampling/sampling.types";
import { ActivationsHistoryDummy } from "@/components/sampling/activations-history-table-dummy";

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
          <div className="md:col-span-2 lg:col-span-3">
            <ActivationHoursHeatmap />
          </div>
          <TrafficDuringActivationChart />
          <div className="md:col-span-2 lg:col-span-2">
            <PromoterImages data={PromoterImagesDummy} />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <ActivationsHistoryTable data={ActivationsHistoryDummy} />
          </div>
        </div>
      </Content>
    </div>
  );
}
