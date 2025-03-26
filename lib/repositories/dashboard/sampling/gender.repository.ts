import { prisma } from '@/lib/prisma'
import { CreateOrUpdateSamplingData } from '@/types/services'
import { Prisma } from '@prisma/client'

export class SamplingGenderRepository {
  static async getBySlug(slug: string) {
    return await prisma.gender.findUnique({ where: { slug } })
  }

  static async createOrUpdate(
    data: CreateOrUpdateSamplingData,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? prisma

    return await client.gender.upsert({
      where: { slug: data.slug },
      update: { description: data.description },
      create: { slug: data.slug, description: data.description },
    })
  }
}
