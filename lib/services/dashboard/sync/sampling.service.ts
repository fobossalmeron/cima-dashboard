import { SamplingFieldsEnum } from '@/enums/sampling-fields'
import { FormSubmissionEntryData } from '@/types/api'
import { extractNumber, slugify } from '@/lib/utils'
import {
  AgeRange,
  ConsumptionMoment,
  Ethnicity,
  Gender,
  Prisma,
  PurchaseIntention,
  SamplingTraffic,
} from '@prisma/client'
import { SamplingProcessingResult } from '@/types/services'
import { prisma } from '@/lib/prisma'
import { SamplingWithRelations } from '@/types/services/sampling.types'
import {
  SamplingTrafficRepository,
  SamplingEthnicityRepository,
  SamplingAgeRangeRepository,
  SamplingGenderRepository,
  SamplingPurchaseIntentionRepository,
  SamplingConsumptionMomentRepository,
  SamplingRepository,
  PurchaseIntentionRepository,
  ConsumptionMomentRepository,
} from '@/lib/repositories'
import { Log } from '@/lib/utils/log'

export class SamplingService {
  private static async processTraffic(
    value?: string,
  ): Promise<SamplingTraffic> {
    if (!value) throw new Error('Traffic value is required')
    const traffic = await SamplingTrafficRepository.getBySlug(slugify(value))
    if (!traffic) throw new Error(`Traffic not found for value: ${value}`)
    return traffic
  }

  private static async processEthnicity(value?: string): Promise<Ethnicity> {
    if (!value) throw new Error('Ethnicity value is required')
    const ethnicity = await SamplingEthnicityRepository.getBySlug(
      slugify(value),
    )
    if (!ethnicity) throw new Error(`Ethnicity not found for value: ${value}`)
    return ethnicity
  }

  private static async processAgeRange(value?: string): Promise<AgeRange> {
    if (!value) throw new Error('Age range value is required')
    const ageRange = await SamplingAgeRangeRepository.getBySlug(slugify(value))
    if (!ageRange) throw new Error(`Age range not found for value: ${value}`)
    return ageRange
  }

  private static async processGender(value?: string): Promise<Gender> {
    if (!value) throw new Error('Gender value is required')
    const gender = await SamplingGenderRepository.getBySlug(slugify(value))
    if (!gender) throw new Error(`Gender not found for value: ${value}`)
    return gender
  }

  private static async processPurchaseIntentions(
    value?: string,
  ): Promise<PurchaseIntention[]> {
    if (!value) throw new Error('Purchase intention value is required')
    const values = value.split(' | ')
    const purchaseIntentions = await Promise.all(
      values.map(async (value) => {
        const purchaseIntention = await PurchaseIntentionRepository.getBySlug(
          slugify(value),
        )
        if (!purchaseIntention)
          throw new Error(`Purchase intention not found for value: ${value}`)
        return purchaseIntention
      }),
    )
    return purchaseIntentions
  }

  private static async processConsumptionMoments(
    value?: string,
  ): Promise<ConsumptionMoment[]> {
    if (!value) throw new Error('Consumption moment value is required')
    const values = value.split(' | ')
    const consumptionMoments = await Promise.all(
      values.map(async (value) => {
        const consumptionMoment = await ConsumptionMomentRepository.getBySlug(
          slugify(value),
        )
        if (!consumptionMoment)
          throw new Error(`Consumption moment not found for value: ${value}`)
        return consumptionMoment
      }),
    )
    return consumptionMoments
  }

  static async processSampling(
    row: FormSubmissionEntryData,
  ): Promise<SamplingProcessingResult> {
    const trafficQuestion = row[SamplingFieldsEnum.TRAFFIC]
    const ethnicityQuestion = row[SamplingFieldsEnum.ETHNICITY]
    const ageRangeQuestion = row[SamplingFieldsEnum.AGE_RANGE]
    const genderQuestion = row[SamplingFieldsEnum.GENDER]
    const purchaseIntentionQuestion = row[SamplingFieldsEnum.PURCHASE_INTENTION]
    const consumptionMomentQuestion = row[SamplingFieldsEnum.CONSUMPTION_MOMENT]
    const netPromoterScoreQuestion = row[SamplingFieldsEnum.NET_PROMOTER_SCORE]
    const followUpQuestion = row[SamplingFieldsEnum.FOLLOW_UP]
    const clientCommentsQuestion = row[SamplingFieldsEnum.CLIENTS_COMMENTS]
    const promotorCommentsQuestion = row[SamplingFieldsEnum.PROMOTOR_COMMENTS]

    const traffic = await this.processTraffic(trafficQuestion?.toString())
    const ethnicity = await this.processEthnicity(ethnicityQuestion?.toString())
    const ageRange = await this.processAgeRange(ageRangeQuestion?.toString())
    const gender = await this.processGender(genderQuestion?.toString())
    const purchaseIntentions = await this.processPurchaseIntentions(
      purchaseIntentionQuestion?.toString(),
    )

    const consumptionMoments = await this.processConsumptionMoments(
      consumptionMomentQuestion?.toString(),
    )

    const netPromoterScore = extractNumber(netPromoterScoreQuestion)

    const followUp = followUpQuestion
      ? followUpQuestion.toString() === 'Yes'
      : false
    const clientComments = clientCommentsQuestion
      ? clientCommentsQuestion.toString()
      : undefined
    const promotorComments = promotorCommentsQuestion
      ? promotorCommentsQuestion.toString()
      : undefined

    return {
      trafficId: traffic.id,
      ethnicityId: ethnicity.id,
      ageRangeId: ageRange.id,
      genderId: gender?.id,
      purchaseIntentions,
      consumptionMoments,
      netPromoterScore,
      followUp,
      clientComments,
      promotorComments,
    }
  }

  static async createOrUpdate(
    row: FormSubmissionEntryData,
    submissionId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<SamplingWithRelations> {
    const client = tx || prisma
    const samplingData = await this.processSampling(row)
    const { purchaseIntentions, consumptionMoments, ...rest } = samplingData
    const data = {
      ...rest,
      submissionId,
    }
    const sampling = await SamplingRepository.createOrUpdate(data, client)
    const purchaseIntentionsWithRelations = await Promise.all(
      purchaseIntentions.map((purchaseIntention) =>
        SamplingPurchaseIntentionRepository.createOrUpdate(
          {
            purchaseIntentionId: purchaseIntention.id,
            samplingId: sampling.id,
          },
          client,
        ),
      ),
    )
    const consumptionMomentsWithRelations = await Promise.all(
      consumptionMoments.map((consumptionMoment) =>
        SamplingConsumptionMomentRepository.createOrUpdate(
          {
            consumptionMomentId: consumptionMoment.id,
            samplingId: sampling.id,
          },
          client,
        ),
      ),
    )
    Log.info('Sampling created')
    return {
      ...sampling,
      purchaseIntentions: purchaseIntentionsWithRelations,
      consumptionMoments: consumptionMomentsWithRelations,
    }
  }
}
