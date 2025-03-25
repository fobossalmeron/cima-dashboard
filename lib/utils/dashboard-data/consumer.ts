import {
  AgeDistributionChartData,
  ConsumerFeedbackData,
  ConsumerImagesData,
  ConsumptionMomentsChartData,
  EthnicityDistributionChartData,
  GenderDistributionChartData,
  NetPromoterScoreChartData,
  PurchaseFactorsChartData,
  RealNetPromoterScoresResult,
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

export function getRealNetPromoterScores(
  data: NetPromoterScoreChartData[],
): RealNetPromoterScoresResult {
  const totalVotes = data.reduce((acc, item) => acc + item.quantity, 0)
  const dataWithPercentages = data.map((item) => ({
    vote: item.vote,
    quantity: item.quantity,
    porcentaje:
      totalVotes > 0
        ? parseFloat(((item.quantity / totalVotes) * 100).toFixed(1))
        : 0,
  }))
  const promotores = data
    .filter((item) => item.vote >= 9)
    .reduce((acc, item) => acc + item.quantity, 0)

  const pasivos = data
    .filter((item) => item.vote >= 7 && item.vote <= 8)
    .reduce((acc, item) => acc + item.quantity, 0)

  const detractores = data
    .filter((item) => item.vote <= 6)
    .reduce((acc, item) => acc + item.quantity, 0)

  // Calcular el porcentaje de cada categoría
  const porcentajePromotores =
    totalVotes > 0 ? (promotores / totalVotes) * 100 : 0
  const porcentajePasivos = totalVotes > 0 ? (pasivos / totalVotes) * 100 : 0
  const porcentajeDetractores =
    totalVotes > 0 ? (detractores / totalVotes) * 100 : 0

  // Calcular el NPS real
  const realNps = porcentajePromotores - porcentajeDetractores

  return {
    realNps,
    totalVotes,
    promotores,
    pasivos,
    detractores,
    porcentajePromotores,
    porcentajePasivos,
    porcentajeDetractores,
    dataWithPercentages,
  }
}

export function getNetPromoterScoreChartData(
  dashboard: DashboardWithRelations,
): NetPromoterScoreChartData[] {
  const promoterScore = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
  }
  dashboard.submissions.forEach((submission) => {
    const netPromoterScore = submission.sampling?.netPromoterScore
    if (
      netPromoterScore &&
      Number(netPromoterScore) in Object.keys(promoterScore)
    ) {
      promoterScore[netPromoterScore as keyof typeof promoterScore] += 1
    }
  })
  return Object.entries(promoterScore)
    .map(([netPromoterScore, quantity]) => ({
      vote: parseInt(netPromoterScore),
      quantity,
    }))
    .sort((a, b) => b.vote - a.vote)
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
