import { prisma } from '@/lib/prisma'
import { Presentation, Prisma } from '@prisma/client'

export class PresentationService {
  static async getAll(tx?: Prisma.TransactionClient): Promise<Presentation[]> {
    const client = tx || prisma
    return await client.presentation.findMany()
  }

  static async getById(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Presentation | null> {
    const client = tx || prisma
    return await client.presentation.findUnique({
      where: { id },
    })
  }

  static async createOrUpdate(
    data: {
      name: string
      slug: string
    },
    tx?: Prisma.TransactionClient,
  ): Promise<Presentation> {
    const client = tx || prisma
    return await client.presentation.upsert({
      where: {
        name: data.name,
      },
      update: {},
      create: data,
    })
  }

  static async create(
    data: Omit<Presentation, 'id' | 'createdAt' | 'updatedAt'>,
    tx?: Prisma.TransactionClient,
  ): Promise<Presentation> {
    const client = tx || prisma
    return await client.presentation.create({
      data,
    })
  }

  static async update(
    id: string,
    data: Partial<Presentation>,
    tx?: Prisma.TransactionClient,
  ): Promise<Presentation> {
    const client = tx || prisma
    return await client.presentation.update({
      where: { id },
      data,
    })
  }

  static async remove(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Presentation> {
    const client = tx || prisma
    return await client.presentation.delete({
      where: { id },
    })
  }
}
