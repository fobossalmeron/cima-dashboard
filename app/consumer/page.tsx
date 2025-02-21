import { AgeDistributionChart } from "@/components/consumer/age-distribution-chart"
import { GenderDistributionChart } from "@/components/consumer/gender-distribution-chart"
import { EthnicityDistributionChart } from "@/components/consumer/ethnicity-distribution-chart"
import { PurchaseFactorsChart } from "@/components/consumer/purchase-factors-chart"
import { ConsumptionMomentsChart } from "@/components/consumer/consumption-moments-chart"
import { ConsumerImages } from "@/components/consumer/consumer-images"
import { ConsumerFeedback } from "@/components/consumer/consumer-feedback"
import { Header } from "@/components/header"
import { Content } from "@/components/content"

export default function ConsumerProfile() {
  return (
    <div className="space-y-6">
      <Header title="Perfil del consumidor" />
      <Content>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AgeDistributionChart />
        <GenderDistributionChart />
        <EthnicityDistributionChart />
        <PurchaseFactorsChart />
        <ConsumptionMomentsChart />
        <ConsumerFeedback />
        </div>

        <ConsumerImages />
      </Content>
    </div>
  )
}

