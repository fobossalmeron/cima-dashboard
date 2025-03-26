import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export class ActiveBrandRepository {
  static async createOrUpdate(
    submissionId: string,
    brandId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? prisma
    return await client.activatedBrand.upsert({
      where: {
        submissionId_brandId: {
          submissionId,
          brandId,
        },
      },
      update: {},
      create: {
        submissionId,
        brandId,
      },
    })
  }
}
