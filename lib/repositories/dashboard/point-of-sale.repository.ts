import { prisma } from '@/lib/prisma'
import { CreatePointOfSaleParams } from '@/types/services'
import { PointOfSale, Prisma } from '@prisma/client'

export class PointOfSaleRepository {
  static async getAll(tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma
    return await client.pointOfSale.findMany()
  }

  static async getById(id: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma
    return await client.pointOfSale.findUnique({
      where: { id },
    })
  }

  static async getBySlug(slug: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma
    return await client.pointOfSale.findUnique({
      where: { slug },
    })
  }

  static async create(
    data: CreatePointOfSaleParams,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? prisma
    return await client.pointOfSale.create({
      data,
    })
  }

  static async createOrUpdate(
    data: CreatePointOfSaleParams,
    tx?: Prisma.TransactionClient,
  ): Promise<PointOfSale> {
    const { name, slug } = data
    const client = tx ?? prisma
    return client.pointOfSale.upsert({
      where: { slug },
      update: { name },
      create: data,
    })
  }
}
