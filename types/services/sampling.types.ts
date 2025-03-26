import {
  ConsumptionMoment,
  ConsumptionMomentSampling,
  PurchaseIntention,
  PurchaseIntentionSampling,
  Sampling,
} from '@prisma/client'

export interface CreateOrUpdateSamplingData {
  slug: string
  description: string
}

export interface CreateOrUpdatePurchaseIntentionSamplingData {
  purchaseIntentionId: string
  samplingId: string
}

export interface CreateOrUpdateConsumptionMomentSamplingData {
  consumptionMomentId: string
  samplingId: string
}

export interface SamplingPurchaseIntentionWithRelations
  extends PurchaseIntentionSampling {
  purchaseIntention: PurchaseIntention
}

export interface SamplingConsumptionMomentWithRelations
  extends ConsumptionMomentSampling {
  consumptionMoment: ConsumptionMoment
}

export interface SamplingWithRelations extends Sampling {
  purchaseIntentions: SamplingPurchaseIntentionWithRelations[]
  consumptionMoments: SamplingConsumptionMomentWithRelations[]
}
