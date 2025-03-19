import { prisma } from '@/lib/prisma'
import { BrandWithSubBrands } from '@/types/api'
import { Brand, Prisma } from '@prisma/client'

export class BrandsService {
  static async getAll(tx?: Prisma.TransactionClient): Promise<Brand[]> {
    const client = tx || prisma
    return await client.brand.findMany()
  }

  static async getAllWithSubBrands(
    tx?: Prisma.TransactionClient,
  ): Promise<BrandWithSubBrands[]> {
    const client = tx || prisma
    return await client.brand.findMany({
      include: {
        subBrands: {
          include: {
            products: {
              include: {
                flavor: true,
                presentation: true,
              },
            },
          },
        },
      },
    })
  }

  static async getById(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Brand | null> {
    const client = tx || prisma
    return await client.brand.findUnique({
      where: { id },
    })
  }

  static async getBySlug(
    slug: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Brand | null> {
    const client = tx || prisma
    return await client.brand.findUnique({ where: { slug } })
  }

  static async createOrUpdate(
    data: {
      name: string
      slug: string
    },
    tx?: Prisma.TransactionClient,
  ): Promise<Brand> {
    const client = tx || prisma
    return await client.brand.upsert({
      where: {
        slug: data.slug,
      },
      update: {
        name: data.name,
      },
      create: data,
    })
  }

  static async create(
    data: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>,
    tx?: Prisma.TransactionClient,
  ): Promise<Brand> {
    const client = tx || prisma
    return await client.brand.create({
      data,
    })
  }

  static async update(
    id: string,
    data: Partial<Brand>,
    tx?: Prisma.TransactionClient,
  ): Promise<Brand> {
    const client = tx || prisma
    return await client.brand.update({
      where: { id },
      data,
    })
  }

  static async remove(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Brand> {
    const client = tx || prisma
    return await client.brand.delete({
      where: { id },
    })
  }
}
