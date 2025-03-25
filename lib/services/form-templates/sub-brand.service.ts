import { prisma } from '@/lib/prisma'
import { Prisma, SubBrand } from '@prisma/client'

export class SubBrandService {
  static async getAll(tx?: Prisma.TransactionClient): Promise<SubBrand[]> {
    const client = tx || prisma
    return await client.subBrand.findMany()
  }

  static async getById(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<SubBrand | null> {
    const client = tx || prisma
    return await client.subBrand.findUnique({
      where: { id },
    })
  }

  static async createOrUpdate(
    data: Omit<SubBrand, 'id' | 'createdAt' | 'updatedAt'>,
    tx?: Prisma.TransactionClient,
  ): Promise<SubBrand> {
    const client = tx || prisma
    return await client.subBrand.upsert({
      where: {
        slug_brandId: {
          slug: data.slug,
          brandId: data.brandId,
        },
      },
      update: {
        name: data.name,
      },
      create: data,
    })
  }

  static async create(
    data: Omit<SubBrand, 'id' | 'createdAt' | 'updatedAt'>,
    tx?: Prisma.TransactionClient,
  ): Promise<SubBrand> {
    const client = tx || prisma
    return await client.subBrand.create({
      data,
    })
  }

  static async update(
    id: string,
    data: Partial<SubBrand>,
    tx?: Prisma.TransactionClient,
  ): Promise<SubBrand> {
    const client = tx || prisma
    return await client.subBrand.update({
      where: { id },
      data,
    })
  }

  static async remove(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<SubBrand> {
    const client = tx || prisma
    return await client.subBrand.delete({
      where: { id },
    })
  }
}
