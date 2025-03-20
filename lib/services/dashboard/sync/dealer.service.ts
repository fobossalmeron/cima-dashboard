import { prisma } from '@/lib/prisma'
import { CreateDealerParams } from '@/types/services/dealer.types'
import { Prisma } from '@prisma/client'

export class DealerService {
  static async create(data: CreateDealerParams, tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma
    return client.dealer.create({
      data,
    })
  }
}
