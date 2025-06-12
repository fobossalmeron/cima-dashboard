import { prisma } from '@/lib/prisma'
import { CoolerSize, PhotoType, Prisma } from '@prisma/client'

export class CoolerSizeRepository {
  static async getAll(): Promise<CoolerSize[]> {
    return await prisma.coolerSize.findMany()
  }

  static async getById(id: string): Promise<CoolerSize | null> {
    return await prisma.coolerSize.findUnique({
      where: { id },
    })
  }

  static async getBySlug(slug: string): Promise<CoolerSize | null> {
    return await prisma.coolerSize.findUnique({
      where: { slug },
    })
  }

  static async createOrUpdate(
    data: {
      slug: string
      description: string
    },
    tx?: Prisma.TransactionClient,
  ): Promise<CoolerSize> {
    const client = tx || prisma
    return await client.coolerSize.upsert({
      where: { slug: data.slug },
      update: data,
      create: data,
    })
  }

  static async createOrUpdatePhotoType(
    data: {
      slug: string
      description: string
    },
    tx?: Prisma.TransactionClient,
  ): Promise<PhotoType> {
    const client = tx || prisma
    return await client.photoType.upsert({
      where: { slug: data.slug },
      update: data,
      create: data,
    })
  }
}
