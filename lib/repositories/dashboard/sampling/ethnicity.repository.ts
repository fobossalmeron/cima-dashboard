import { prisma } from '@/lib/prisma'
import { CreateOrUpdateSamplingData } from '@/types/services'
import { Prisma } from '@prisma/client'

export class SamplingEthnicityRepository {
  static async getAll() {
    return await prisma.ethnicity.findMany()
  }

  static async getBySlug(slug: string) {
    return await prisma.ethnicity.findUnique({ where: { slug } })
  }

  static async createOrUpdate(
    data: CreateOrUpdateSamplingData,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? prisma

    return await client.ethnicity.upsert({
      where: { slug: data.slug },
      update: { description: data.description },
      create: { slug: data.slug, description: data.description },
    })
  }
}
