import { prisma } from '@/lib/prisma'
import { CreateProductLocationParams } from '@/types/services'
import { Prisma } from '@prisma/client'

export class ProductLocationRepository {
  static async createOrUpdate(
    data: CreateProductLocationParams,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? prisma
    return client.productLocation.upsert({
      where: { slug: data.slug },
      update: { name: data.name },
      create: data,
    })
  }
}
