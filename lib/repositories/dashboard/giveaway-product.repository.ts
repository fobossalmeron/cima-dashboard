import { prisma } from '@/lib/prisma'
import { CreateGiveawayData } from '@/types/services'
import { Prisma } from '@prisma/client'

export class GiveawayProductRepository {
  static async createOrUpdate(
    data: CreateGiveawayData,
    tx?: Prisma.TransactionClient,
  ) {
    const { giveawayProductTypeId, submissionId, quantity } = data
    const client = tx || prisma
    return await client.giveawayProduct.upsert({
      where: {
        giveawayProductTypeId_submissionId: {
          giveawayProductTypeId,
          submissionId,
        },
      },
      update: {
        quantity,
      },
      create: {
        giveawayProductTypeId,
        submissionId,
        quantity,
      },
    })
  }
}
