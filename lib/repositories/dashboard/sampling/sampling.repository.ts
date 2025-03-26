import { prisma } from '@/lib/prisma'
import { SamplingData } from '@/types/services'
import { Prisma, Sampling } from '@prisma/client'

export class SamplingRepository {
  static async createOrUpdate(
    data: SamplingData,
    tx?: Prisma.TransactionClient,
  ): Promise<Sampling> {
    const client = tx ?? prisma
    const { submissionId, ...rest } = data
    return client.sampling.upsert({
      where: { submissionId },
      update: rest,
      create: data,
    })
  }
}
