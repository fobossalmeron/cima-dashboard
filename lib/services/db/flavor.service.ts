import { prisma } from '@/lib/prisma'
import { Flavor, Prisma } from '@prisma/client'

export class FlavorService {
  static async getAll(tx?: Prisma.TransactionClient): Promise<Flavor[]> {
    const client = tx || prisma
    return await client.flavor.findMany()
  }

  static async getById(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Flavor | null> {
    const client = tx || prisma
    return await client.flavor.findUnique({
      where: { id },
    })
  }

  static async createOrUpdate(
    data: {
      name: string
      slug: string
    },
    tx?: Prisma.TransactionClient,
  ): Promise<Flavor> {
    const client = tx || prisma
    return await client.flavor.upsert({
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
    data: Omit<Flavor, 'id' | 'createdAt' | 'updatedAt'>,
    tx?: Prisma.TransactionClient,
  ): Promise<Flavor> {
    const client = tx || prisma
    return await client.flavor.create({
      data,
    })
  }

  static async update(
    id: string,
    data: Partial<Flavor>,
    tx?: Prisma.TransactionClient,
  ): Promise<Flavor> {
    const client = tx || prisma
    return await client.flavor.update({
      where: { id },
      data,
    })
  }

  static async remove(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Flavor> {
    const client = tx || prisma
    return await client.flavor.delete({
      where: { id },
    })
  }
}
