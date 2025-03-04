import { Header } from "@/components/header";
import { Content } from "@/components/content";
import { TrafficDuringActivationChart } from "@/components/sampling/traffic-during-activation-chart";
import { ActivationHoursHeatmap } from "@/components/sampling/activation-hours-heatmap";
import { ActivationsTable } from "@/components/sampling/activations-table";
import { PromoterImage } from "@/components/sampling/promoter-image";

export default function Sampling() {
  return (
    <div className="space-y-6">
      <Header title="Sampling" />
      <Content>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <ActivationHoursHeatmap />
          </div>
          <TrafficDuringActivationChart />
          <PromoterImage />
          <div className="md:col-span-2">
            <ActivationsTable />
          </div>
        </div>
      </Content>
    </div>
  );
}
