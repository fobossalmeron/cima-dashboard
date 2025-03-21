import { ConsumptionMoment, PurchaseIntention, Sampling } from '@prisma/client'

export interface CreateOrUpdateSamplingData {
  slug: string
  description: string
}

export interface SamplingWithRelations extends Sampling {
  purchaseIntentions: PurchaseIntention[]
  consumptionMoments: ConsumptionMoment[]
}
