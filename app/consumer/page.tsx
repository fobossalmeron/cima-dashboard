import { AgeDistributionChart } from "@/components/consumer-profile/age-distribution-chart"
import { GenderDistributionChart } from "@/components/consumer-profile/gender-distribution-chart"
import { EthnicityDistributionChart } from "@/components/consumer-profile/ethnicity-distribution-chart"
import { PurchaseFactorsChart } from "@/components/consumer-profile/purchase-factors-chart"
import { ConsumptionMomentsChart } from "@/components/consumer-profile/consumption-moments-chart"
import { ConsumerImages } from "@/components/consumer-profile/consumer-images"
import { ConsumerFeedback } from "@/components/consumer-profile/consumer-feedback"
import { Header } from "@/components/header"

export default function ConsumerProfile() {
  return (
    <div className="space-y-6">
      <Header title="Perfil del consumidor" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AgeDistributionChart />
        <GenderDistributionChart />
        <EthnicityDistributionChart />
        <PurchaseFactorsChart />
        <ConsumptionMomentsChart />
        <ConsumerFeedback />
      </div>

      <ConsumerImages />
    </div>
  )
}

