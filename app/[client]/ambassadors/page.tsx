import { Header } from "@/components/header";
import { Content } from "@/components/content";
import { SalesByAmbassadorChart } from "@/components/ambassadors/sales-by-ambassador-chart";
import { AmbassadorsTable } from "@/components/ambassadors/ambassadors-table";
import { ActivationsVsSalesChart } from "@/components/ambassadors/activations-vs-sales-chart";
import { Ambassador } from "@/components/ambassadors/ambassadors.types";

/* Esta página se alimenta de un solo objeto puesto que todas las gráficas usan la misma data */

const AmbassadorsDataDummy: Ambassador[] = [
  {
    name: "Laura Martinez",
    activations: 32,
    totalSales: 1025,
    averageSales: 32.03,
  },
  {
    name: "Camila Rodriguez",
    activations: 28,
    totalSales: 925,
    averageSales: 33.04,
  },
  {
    name: "Valentina Gomez",
    activations: 24,
    totalSales: 812,
    averageSales: 33.83,
  },
  {
    name: "Isabella Fernandez",
    activations: 22,
    totalSales: 765,
    averageSales: 34.77,
  },
  { name: "Sofia Lopez", activations: 20, totalSales: 720, averageSales: 36.0 },
  {
    name: "Maria Garcia",
    activations: 19,
    totalSales: 680,
    averageSales: 35.79,
  },
  {
    name: "Lucia Perez",
    activations: 18,
    totalSales: 650,
    averageSales: 36.11,
  },
  {
    name: "Emma Sanchez",
    activations: 17,
    totalSales: 625,
    averageSales: 36.76,
  },
  { name: "Mia Ramirez", activations: 16, totalSales: 600, averageSales: 37.5 },
  {
    name: "Victoria Torres",
    activations: 15,
    totalSales: 575,
    averageSales: 38.33,
  },
  {
    name: "Stefee Paola Agudelo",
    activations: 37,
    totalSales: 1097,
    averageSales: 29.65,
  },
  {
    name: "Katherin Herrera",
    activations: 34,
    totalSales: 851,
    averageSales: 25.03,
  },
  {
    name: "Katheryne Torres",
    activations: 25,
    totalSales: 712,
    averageSales: 28.48,
  },
  {
    name: "Marcela Arias",
    activations: 16,
    totalSales: 488,
    averageSales: 30.5,
  },
  {
    name: "Maria Gabriela Arteaga",
    activations: 18,
    totalSales: 473,
    averageSales: 26.28,
  },
  {
    name: "Angelica Kurbaje",
    activations: 16,
    totalSales: 437,
    averageSales: 27.31,
  },
];

export default function BrandAmbassadors() {
  return (
    <div>
      <Header title="Embajadoras de marca" />
      <Content>
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SalesByAmbassadorChart data={AmbassadorsDataDummy} />
            <AmbassadorsTable data={AmbassadorsDataDummy} />
          </div>
          <ActivationsVsSalesChart data={AmbassadorsDataDummy} />
        </div>
      </Content>
    </div>
  );
}
