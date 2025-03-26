import { prisma } from '@/lib/prisma'
import { CreateOrUpdateSamplingData } from '@/types/services'
import { Prisma } from '@prisma/client'

export class SamplingTrafficRepository {
  static async getAll() {
    return await prisma.samplingTraffic.findMany()
  }

  static async getBySlug(slug: string) {
    return await prisma.samplingTraffic.findUnique({ where: { slug } })
  }

  static async createOrUpdate(
    data: CreateOrUpdateSamplingData,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? prisma
    return await client.samplingTraffic.upsert({
      where: { slug: data.slug },
      update: { description: data.description },
      create: { slug: data.slug, description: data.description },
    })
  }
}
