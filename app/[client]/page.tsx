"use client";

import { Header } from "@/components/header";
import { Content } from "@/components/content";
import { ActivationSalesChart } from "@/components/general/activation-sales-chart";
import { Maps } from "@/components/general/maps";
import { Kpis } from "@/components/general/kpis";
import { KpisData } from "@/components/general/general.types";

const KpisDummy: KpisData = {
  activations: 112,
  locationsVisited: 85,
  samplesDelivered: 5000,
  unitsSold: 2500,
  conversion: 90,
  velocity: 10.5,
  nps: 62,
  followings: 32,
};

export default function ClientDashboard() {
  return (
    <div>
      <Header title={"KPIs Generales"} />
      <Content>
        <div className="w-full grid grid-cols-1 lg:grid-cols-[67%_31%] gap-8">
          <Maps />
          <Kpis data={KpisDummy} />
          <div className="col-span-1 lg:col-span-2">
            <ActivationSalesChart />
          </div>
        </div>
      </Content>
    </div>
  );
}
