import { ConsumptionMoment, PurchaseIntention } from '@prisma/client'

export interface SamplingProcessingResult {
  trafficId: string
  ethnicityId: string
  ageRangeId: string
  genderId: string
  purchaseIntentions: PurchaseIntention[]
  consumptionMoments: ConsumptionMoment[]
  netPromoterScore: number | null
  followUp: boolean
  clientComments?: string
  promotorComments?: string
}
