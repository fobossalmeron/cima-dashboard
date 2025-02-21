import { TrafficDuringActivationChart } from "@/components/sales/traffic-during-activation-chart";
import { ActivationHoursHeatmap } from "@/components/sales/activation-hours-heatmap";
import { Header } from "@/components/header";
import { Content } from "@/components/content";
import { ActivationsTable } from "@/components/sales/activations-table";
import { PromoterImage } from "@/components/sales/promoter-image";

export default function Sampling() {
  return (
    <div className="space-y-6">
      <Header title="Activaciones" />
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
