import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export class ProductLocationSubmissionRepository {
  static async create(
    data: Prisma.ProductLocationSubmissionCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? prisma
    return await client.productLocationSubmission.create({
      data,
    })
  }

  static async findByProductLocationId(
    productLocationId: string,
    submissionId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? prisma
    return await client.productLocationSubmission.findFirst({
      where: { productLocationId, submissionId },
    })
  }
}
