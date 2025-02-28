import { Header } from "@/components/header";
import { Content } from "@/components/content";
import { SalesByAmbassadorChart } from "@/components/ambassadors/sales-by-ambassador-chart";
import { AmbassadorsTable } from "@/components/ambassadors/ambassadors-table";
import { ActivationsVsSalesChart } from "@/components/ambassadors/activations-vs-sales-chart";

export default function BrandAmbassadors() {
  return (
    <div>
      <Header title="Embajadoras de marca" />
      <Content>
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SalesByAmbassadorChart />
            <AmbassadorsTable />
          </div>
          <ActivationsVsSalesChart />
        </div>
      </Content>
    </div>
  );
}
