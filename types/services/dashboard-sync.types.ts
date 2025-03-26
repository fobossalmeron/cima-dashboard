import { DataFieldSearchType, DataFieldsEnum } from '@/enums/data-fields'
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

export interface SamplingData
  extends Omit<
    SamplingProcessingResult,
    'purchaseIntentions' | 'consumptionMoments'
  > {
  submissionId: string
}

export type DataFieldTags = {
  [DataFieldsEnum.FIRST_ACTIVATION]: {
    tags: string[]
    searchType: DataFieldSearchType
  }
}

export const DataFieldsTagsValues: DataFieldTags = {
  [DataFieldsEnum.FIRST_ACTIVATION]: {
    tags: ['PRIMERA VEZ', 'ACTIVACIÓN'],
    searchType: DataFieldSearchType.AND,
  },
}
