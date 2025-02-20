"use client";

import { AmbassadorKPIs } from "@/components/brand-ambassadors/ambassador-kpis";
import { AmbassadorDistributionMap } from "@/components/brand-ambassadors/ambassador-distribution-map";
import { AmbassadorSalesRanking } from "@/components/brand-ambassadors/ambassador-sales-ranking";
import { AmbassadorActivations } from "@/components/brand-ambassadors/ambassador-activations";
import { AmbassadorSalesEvolution } from "@/components/brand-ambassadors/ambassador-sales-evolution";
import { AmbassadorGallery } from "@/components/brand-ambassadors/ambassador-gallery";
import { Header } from "@/components/header";
import { Content } from "@/components/content";
export default function BrandAmbassadors() {
  return (
    <div>
      <Header title="Embajadoras de marca" />
      <Content>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <AmbassadorKPIs />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <AmbassadorDistributionMap />
          </div>
          <AmbassadorSalesRanking />
          <AmbassadorActivations />
          <div className="md:col-span-2">
            <AmbassadorSalesEvolution />
          </div>
          <div className="md:col-span-2">
            <AmbassadorGallery />
          </div>
        </div>
      </Content>
    </div>
  );
}
