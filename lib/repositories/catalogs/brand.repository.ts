import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export class BrandRepository {
  static async createOrUpdate(
    name: string,
    slug: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? prisma
    return await client.brand.upsert({
      where: {
        slug,
      },
      update: {
        name,
      },
      create: { name, slug },
    })
  }
}
