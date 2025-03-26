import { prisma } from '@/lib/prisma'
import { CreateOrUpdateSamplingData } from '@/types/services'
import { Prisma } from '@prisma/client'

export class ConsumptionMomentRepository {
  static async getById(id: string) {
    return await prisma.consumptionMoment.findUnique({ where: { id } })
  }

  static async getBySlug(slug: string) {
    return await prisma.consumptionMoment.findUnique({ where: { slug } })
  }

  static async createOrUpdate(
    data: CreateOrUpdateSamplingData,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? prisma
    return await client.consumptionMoment.upsert({
      where: { slug: data.slug },
      update: { description: data.description },
      create: { slug: data.slug, description: data.description },
    })
  }
}
