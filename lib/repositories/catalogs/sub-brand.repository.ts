import { prisma } from '@/lib/prisma'
import { SubBrandWithBrand } from '@/types/api'
import { Prisma, SubBrand } from '@prisma/client'

export class SubBrandRepository {
  static async getBySlug(
    slug: string,
    tx?: Prisma.TransactionClient,
  ): Promise<SubBrandWithBrand | null> {
    const client = tx ?? prisma
    return await client.subBrand.findUnique({
      where: { slug },
      include: { brand: true },
    })
  }

  static async createOrUpdate(
    data: {
      name: string
      slug: string
      brandId: string
    },
    tx?: Prisma.TransactionClient,
  ): Promise<SubBrandWithBrand> {
    const client = tx ?? prisma
    const { name, slug, brandId } = data
    return await client.subBrand.upsert({
      where: { slug },
      update: {},
      create: { name, slug, brandId },
      include: {
        brand: true,
      },
    })
  }

  static async remove(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<SubBrand> {
    const client = tx ?? prisma
    return await client.subBrand.delete({
      where: { id },
    })
  }
}
