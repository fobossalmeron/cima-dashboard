import {
  AgeDistributionChartData,
  ConsumerFeedbackData,
  ConsumerImagesData,
  ConsumptionMomentsChartData,
  EthnicityDistributionChartData,
  GenderDistributionChartData,
  NetPromoterScoreChartData,
  PurchaseFactorsChartData,
} from '@/components/consumer/consumer.types'
import { PhotoTypesEnum } from '@/enums/photos-fields'
import { DashboardWithRelations } from '@/types/api/clients'

export function getAgeDistributionChartData(
  dashboard: DashboardWithRelations,
): AgeDistributionChartData[] {
  const ageDistribution = dashboard.submissions.reduce((acc, submission) => {
    const age = submission.sampling?.ageRange?.description
    if (!age) return acc
    if (acc[age]) {
      acc[age] += 1
    } else {
      acc[age] = 1
    }
    return acc
  }, {} as Record<string, number>)
  return Object.entries(ageDistribution).map(([age, quantity]) => ({
    ageRange: age as AgeDistributionChartData['ageRange'],
    quantity,
  }))
}

export function getGenderDistributionChartData(
  dashboard: DashboardWithRelations,
): GenderDistributionChartData[] {
  const genderDistribution = dashboard.submissions.reduce((acc, submission) => {
    const gender = submission.sampling?.gender?.description
    if (!gender) return acc
    if (acc[gender]) {
      acc[gender] += 1
    } else {
      acc[gender] = 1
    }
    return acc
  }, {} as Record<string, number>)
  return Object.entries(genderDistribution).map(([gender, quantity]) => ({
    gender,
    quantity,
  }))
}

export function getEthnicityDistributionChartData(
  dashboard: DashboardWithRelations,
): EthnicityDistributionChartData[] {
  const ethnicityDistribution = dashboard.submissions.reduce(
    (acc, submission) => {
      const ethnicity = submission.sampling?.ethnicity?.description
      if (!ethnicity) return acc
      if (acc[ethnicity]) {
        acc[ethnicity] += 1
      } else {
        acc[ethnicity] = 1
      }
      return acc
    },
    {} as Record<string, number>,
  )
  return Object.entries(ethnicityDistribution).map(([ethnicity, quantity]) => ({
    ethnicity,
    quantity,
  }))
}

export function getPurchaseFactorsChartData(
  dashboard: DashboardWithRelations,
): PurchaseFactorsChartData[] {
  const purchaseFactors = dashboard.submissions.reduce((acc, submission) => {
    submission.sampling?.purchaseIntentions.forEach((purchaseFactor) => {
      if (acc[purchaseFactor.purchaseIntention.description]) {
        acc[purchaseFactor.purchaseIntention.description] += 1
      } else {
        acc[purchaseFactor.purchaseIntention.description] = 1
      }
    })
    return acc
  }, {} as Record<string, number>)
  return Object.entries(purchaseFactors).map(([purchaseFactor, quantity]) => ({
    factor: purchaseFactor as PurchaseFactorsChartData['factor'],
    quantity,
  }))
}

export function getConsumptionMomentsChartData(
  dashboard: DashboardWithRelations,
): ConsumptionMomentsChartData[] {
  const consumptionMoments = dashboard.submissions.reduce((acc, submission) => {
    submission.sampling?.consumptionMoments.forEach((consumptionMoment) => {
      if (acc[consumptionMoment.consumptionMoment.description]) {
        acc[consumptionMoment.consumptionMoment.description] += 1
      } else {
        acc[consumptionMoment.consumptionMoment.description] = 1
      }
    })
    return acc
  }, {} as Record<string, number>)
  return Object.entries(consumptionMoments).map(
    ([consumptionMoment, quantity]) => ({
      moment: consumptionMoment as ConsumptionMomentsChartData['moment'],
      quantity,
    }),
  )
}

export function getNetPromoterScoreChartData(
  dashboard: DashboardWithRelations,
): NetPromoterScoreChartData[] {
  const netPromoterScore = dashboard.submissions.reduce((acc, submission) => {
    const netPromoterScore = submission.sampling?.netPromoterScore
    if (!netPromoterScore) return acc
    if (acc[netPromoterScore]) {
      acc[netPromoterScore] += 1
    } else {
      acc[netPromoterScore] = 1
    }
    return acc
  }, {} as Record<string, number>)
  return Object.entries(netPromoterScore).map(
    ([netPromoterScore, quantity]) => ({
      vote: parseInt(netPromoterScore),
      quantity,
    }),
  )
}

export function getConsumerFeedbackData(
  dashboard: DashboardWithRelations,
): ConsumerFeedbackData[] {
  const consumerFeedback = dashboard.submissions
    .filter(
      (submission) => submission.sampling && submission.sampling.clientComments,
    )
    .map((submission) => ({
      comment: submission.sampling!.clientComments!,
    }))
  return consumerFeedback
}

export function getConsumerImagesData(
  dashboard: DashboardWithRelations,
): ConsumerImagesData[] {
  return dashboard.submissions
    .map((submission) => {
      return submission.photos
        .filter((photo) => photo.type.slug === PhotoTypesEnum.CLIENT)
        .map((photo) => ({
          locationName: submission.location?.name ?? '',
          address: submission.location?.address ?? '',
          url: photo.url,
        }))
    })
    .flat()
}
