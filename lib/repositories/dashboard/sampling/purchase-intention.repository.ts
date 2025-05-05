import { prisma } from '@/lib/prisma'
import {
  CreateOrUpdatePurchaseIntentionSamplingData,
  SamplingPurchaseIntentionWithRelations,
} from '@/types/services'
import { Prisma } from '@prisma/client'
import { PurchaseIntentionRepository } from '../../catalogs'

export class SamplingPurchaseIntentionRepository {
  static async getFirst(data: CreateOrUpdatePurchaseIntentionSamplingData) {
    return await prisma.purchaseIntentionSampling.findFirst({
      where: {
        purchaseIntentionId: data.purchaseIntentionId,
        samplingId: data.samplingId,
      },
    })
  }

  static async createOrUpdate(
    data: CreateOrUpdatePurchaseIntentionSamplingData,
    tx?: Prisma.TransactionClient,
  ): Promise<SamplingPurchaseIntentionWithRelations> {
    const client = tx ?? prisma
    let purchaseIntention = await PurchaseIntentionRepository.getById(
      data.purchaseIntentionId,
    )
    if (!purchaseIntention) {
      purchaseIntention = await PurchaseIntentionRepository.createOrUpdate(
        {
          slug: data.slug,
          description: data.description,
        },
        client,
      )
    }
    const purchaseIntentionSamplingExists = await this.getFirst(data)
    if (purchaseIntentionSamplingExists) {
      // Delete the existing purchase intention sampling
      await client.purchaseIntentionSampling.delete({
        where: {
          purchaseIntentionId_samplingId: {
            purchaseIntentionId:
              purchaseIntentionSamplingExists.purchaseIntentionId,
            samplingId: purchaseIntentionSamplingExists.samplingId,
          },
        },
      })
      // Create the new purchase intention sampling
      const purchaseIntentionSampling =
        await client.purchaseIntentionSampling.create({
          data: {
            purchaseIntentionId: purchaseIntention.id,
            samplingId: data.samplingId,
          },
        })
      return {
        ...purchaseIntentionSampling,
        purchaseIntention,
      }
    }
    // Create a new purchase intention sampling
    const purchaseIntentionSampling =
      await client.purchaseIntentionSampling.create({
        data: {
          purchaseIntentionId: purchaseIntention.id,
          samplingId: data.samplingId,
        },
      })
    return {
      ...purchaseIntentionSampling,
      purchaseIntention,
    }
  }
}
