'use client'

import { AgeDistributionChart } from '@/components/consumer/age-distribution-chart'
import { GenderDistributionChart } from '@/components/consumer/gender-distribution-chart'
import { EthnicityDistributionChart } from '@/components/consumer/ethnicity-distribution-chart'
import { PurchaseFactorsChart } from '@/components/consumer/purchase-factors-chart'
import { ConsumptionMomentsChart } from '@/components/consumer/consumption-moments-chart'
import { ConsumerImages } from '@/components/consumer/consumer-images'
import { ConsumerFeedback } from '@/components/consumer/consumer-feedback'
import { NetPromoterScoreChart } from '@/components/consumer/net-promoter-score-chart'
import { Header } from '@/components/header'
import { Content } from '@/components/content'
import { useClientContext } from '@/lib/context/ClientContext'
import {
  getAgeDistributionChartData,
  getConsumerFeedbackData,
  getConsumerImagesData,
  getConsumptionMomentsChartData,
  getEthnicityDistributionChartData,
  getGenderDistributionChartData,
  getNetPromoterScoreChartData,
  getPurchaseFactorsChartData,
} from '@/lib/utils/dashboard-data/consumer'

export default function ConsumerProfile() {
  const { dashboardData } = useClientContext()

  if (!dashboardData) {
    return <div>No dashboard data found</div>
  }

  const ageDistributionChartData = getAgeDistributionChartData(dashboardData)
  const genderDistributionChartData =
    getGenderDistributionChartData(dashboardData)
  const ethnicityDistributionChartData =
    getEthnicityDistributionChartData(dashboardData)
  const purchaseFactorsChartData = getPurchaseFactorsChartData(dashboardData)
  const consumptionMomentsChartData =
    getConsumptionMomentsChartData(dashboardData)
  const netPromoterScoreChartData = getNetPromoterScoreChartData(dashboardData)
  const consumerFeedbackData = getConsumerFeedbackData(dashboardData)
  const consumerImagesData = getConsumerImagesData(dashboardData)

  return (
    <div>
      <Header title="Perfil del consumidor" />
      <Content>
        <div className="grid grid-cols-1 lg:grid-cols-3 print:grid-cols-3 gap-6">
          <AgeDistributionChart data={ageDistributionChartData} />
          <GenderDistributionChart data={genderDistributionChartData} />
          <EthnicityDistributionChart data={ethnicityDistributionChartData} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 print:grid-cols-3 gap-6 mt-6">
          <PurchaseFactorsChart data={purchaseFactorsChartData} />
          <ConsumptionMomentsChart data={consumptionMomentsChartData} />
          <NetPromoterScoreChart data={netPromoterScoreChartData} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 print:grid-cols-3 gap-6 mt-6">
          <ConsumerFeedback data={consumerFeedbackData} />
          <div className="col-span-1 lg:col-span-2 print:col-span-2">
            <ConsumerImages data={consumerImagesData} />
          </div>
        </div>
      </Content>
    </div>
  )
}
