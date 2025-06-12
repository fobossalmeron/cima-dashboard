import { prisma } from '@/lib/prisma'
import { PhotoType, PopType, Prisma } from '@prisma/client'

export class PopTypeRepository {
  static async getAll(): Promise<PopType[]> {
    return await prisma.popType.findMany()
  }

  static async getById(id: string): Promise<PopType | null> {
    return await prisma.popType.findUnique({
      where: { id },
    })
  }

  static async getBySlug(slug: string): Promise<PopType | null> {
    return await prisma.popType.findUnique({
      where: { slug },
    })
  }

  static async createOrUpdate(
    data: {
      slug: string
      description: string
    },
    tx?: Prisma.TransactionClient,
  ): Promise<PopType> {
    const client = tx || prisma
    return await client.popType.upsert({
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
