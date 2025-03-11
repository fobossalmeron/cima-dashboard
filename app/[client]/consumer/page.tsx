import { AgeDistributionChart } from "@/components/consumer/age-distribution-chart";
import { GenderDistributionChart } from "@/components/consumer/gender-distribution-chart";
import { EthnicityDistributionChart } from "@/components/consumer/ethnicity-distribution-chart";
import { PurchaseFactorsChart } from "@/components/consumer/purchase-factors-chart";
import { ConsumptionMomentsChart } from "@/components/consumer/consumption-moments-chart";
import { ConsumerImages } from "@/components/consumer/consumer-images";
import { ConsumerFeedback } from "@/components/consumer/consumer-feedback";
import { NetPromoterScoreChart } from "@/components/consumer/net-promoter-score-chart";
import { Header } from "@/components/header";
import { Content } from "@/components/content";
import {
  AgeDistributionChartData,
  GenderDistributionChartData,
  EthnicityDistributionChartData,
  PurchaseFactorsChartData,
  ConsumptionMomentsChartData,
  ConsumerFeedbackData,
  ConsumerImagesData,
  NetPromoterScoreChartData,
} from "@/components/consumer/consumer.types";

const AgeDistributionChartDummy: AgeDistributionChartData[] = [
  { ageRange: "18-24", quantity: 150 },
  { ageRange: "25-34", quantity: 300 },
  { ageRange: "35-44", quantity: 250 },
  { ageRange: "45-54", quantity: 200 },
  { ageRange: "55-64", quantity: 100 },
  { ageRange: "65+", quantity: 50 },
];

const GenderDistributionChartDummy: GenderDistributionChartData[] = [
  { gender: "Femenino", quantity: 70 },
  { gender: "Masculino", quantity: 99 },
  { gender: "Otro", quantity: 2 },
];

const EthnicityDistributionChartDummy: EthnicityDistributionChartData[] = [
  { ethnicity: "Afroamericanos", quantity: 20 },
  { ethnicity: "Hispanos", quantity: 140 },
  { ethnicity: "Americanos", quantity: 20 },
  { ethnicity: "Otro", quantity: 10 },
];

const PurchaseFactorsChartDummy: PurchaseFactorsChartData[] = [
  { factor: "Sabor", quantity: 481 },
  { factor: "Precio", quantity: 202 },
  { factor: "Ingredientes", quantity: 69 },
  { factor: "Imagen", quantity: 43 },
  { factor: "Otros", quantity: 26 },
];

const ConsumptionMomentsChartDummy: ConsumptionMomentsChartData[] = [
  { moment: "Casa", quantity: 1200 },
  { moment: "Trabajo", quantity: 750 },
  { moment: "Reuniones sociales", quantity: 600 },
  { moment: "Estudio", quantity: 450 },
];

const NetPromoterScoreChartDummy: NetPromoterScoreChartData[] = [
  { vote: 10, quantity: 254 },
  { vote: 9, quantity: 187 },
  { vote: 8, quantity: 53 },
  { vote: 7, quantity: 31 },
  { vote: 6, quantity: 22 },
  { vote: 5, quantity: 4 },
  { vote: 4, quantity: 3 },
  { vote: 3, quantity: 1 },
  { vote: 2, quantity: 2 },
  { vote: 1, quantity: 20 },
  { vote: 0, quantity: 16 },
];

const ConsumerFeedbackDummy: ConsumerFeedbackData[] = [
  {
    comment:
      "El sabor es muy auténtico y natural, realmente se nota la calidad de los ingredientes",
  },
  {
    comment: "Me gusta la presentación y el empaque",
  },
  {
    comment:
      "Precio un poco elevado pero vale la pena por la calidad que ofrece el producto",
  },
  {
    comment: "Perfecto para llevar al trabajo",
  },
  {
    comment:
      "Me gustaría más variedad de sabores para poder elegir entre más opciones",
  },
  {
    comment: "Excelente calidad, lo recomiendo",
  },
  {
    comment: "Buen producto pero podría mejorar el tamaño",
  },
  {
    comment: "Muy práctico para el día a día",
  },
  {
    comment: "El sabor es demasiado intenso para mi gusto",
  },
  {
    comment: "Me encanta la textura y consistencia",
  },
  {
    comment: "Buen producto pero el empaque podría ser más ecológico",
  },
  {
    comment: "Perfecto para compartir con amigos",
  },
  {
    comment: "El mejor producto que he probado en su categoría",
  },
  {
    comment: "Bueno pero esperaba más por el precio",
  },
  {
    comment: "Me sorprendió gratamente la calidad",
  },
];

const ConsumerImagesDummy: ConsumerImagesData[] = [
  {
    url: "/placeholder.svg",
    locationName: "Food Star",
    address: "5521 Leesburg Pike, 22041, Bailey's Crossroads, Virginia",
  },
  {
    url: "/placeholder.svg",
    locationName: "Stamford Market",
    address: "123 Broad St, 06901, Stamford, Connecticut",
  },
  {
    url: "/placeholder.svg",
    locationName: "Greenwich Grocer",
    address: "456 E Putnam Ave, 06830, Greenwich, Connecticut",
  },
  {
    url: "/placeholder.svg",
    locationName: "Norwalk Mart",
    address: "789 Main Ave, 06851, Norwalk, Connecticut",
  },
  {
    url: "/placeholder.svg",
    locationName: "Stamford Market",
    address: "123 Broad St, 06901, Stamford, Connecticut",
  },
  {
    url: "/placeholder.svg",
    locationName: "Food Star",
    address: "5521 Leesburg Pike, 22041, Bailey's Crossroads, Virginia",
  },
];

export default function ConsumerProfile() {
  return (
    <div>
      <Header title="Perfil del consumidor" />
      <Content>
        <div className="grid grid-cols-1 lg:grid-cols-3 print:grid-cols-3 gap-6">
          <AgeDistributionChart data={AgeDistributionChartDummy} />
          <GenderDistributionChart data={GenderDistributionChartDummy} />
          <EthnicityDistributionChart data={EthnicityDistributionChartDummy} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 print:grid-cols-3 gap-6 mt-6">
          <PurchaseFactorsChart data={PurchaseFactorsChartDummy} />
          <ConsumptionMomentsChart data={ConsumptionMomentsChartDummy} />
          <NetPromoterScoreChart data={NetPromoterScoreChartDummy} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 print:grid-cols-3 gap-6 mt-6">
          <ConsumerFeedback data={ConsumerFeedbackDummy} />
          <div className="col-span-1 lg:col-span-2 print:col-span-2">
            <ConsumerImages data={ConsumerImagesDummy} />
          </div>
        </div>
      </Content>
    </div>
  );
}
