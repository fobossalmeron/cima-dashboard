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
} from "@/components/consumer/consumer.types";

const AgeDistributionChartDummy: AgeDistributionChartData[] = [
  { ageRange: "18-24", consumers: 150 },
  { ageRange: "25-34", consumers: 300 },
  { ageRange: "35-44", consumers: 250 },
  { ageRange: "45-54", consumers: 200 },
  { ageRange: "55-64", consumers: 100 },
  { ageRange: "65+", consumers: 50 },
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

export default function ConsumerProfile() {
  return (
    <div className="space-y-6">
      <Header title="Perfil del consumidor" />
      <Content>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AgeDistributionChart data={AgeDistributionChartDummy} />
          <GenderDistributionChart data={GenderDistributionChartDummy} />
          <EthnicityDistributionChart data={EthnicityDistributionChartDummy} />
          <PurchaseFactorsChart />
          <ConsumptionMomentsChart />
          <NetPromoterScoreChart />
          <ConsumerFeedback />
          <div className="col-span-1 lg:col-span-2">
            <ConsumerImages />
          </div>
        </div>
      </Content>
    </div>
  );
}
