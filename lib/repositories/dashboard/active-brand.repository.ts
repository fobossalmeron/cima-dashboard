import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export class ActiveBrandRepository {
  static async createOrUpdate(
    submissionId: string,
    brandId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? prisma
    const activeBrand = await client.activatedBrand.findUnique({
      where: {
        submissionId_brandId: {
          submissionId,
          brandId,
        },
      },
    })
    if (activeBrand) return activeBrand
    return await client.activatedBrand.create({
      data: {
        submissionId,
        brandId,
      },
    })
  }
}
