import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'
import { Presentation } from '@prisma/client'

export class PresentationsService {
  static async getAll(): Promise<Presentation[]> {
    return await prisma.presentation.findMany()
  }

  static async getById(id: string): Promise<Presentation | null> {
    return await prisma.presentation.findUnique({
      where: { id },
    })
  }

  static async createOrUpdate(data: { name: string }): Promise<Presentation> {
    return await prisma.presentation.upsert({
      where: {
        name: data.name,
      },
      update: {},
      create: {
        name: data.name,
        slug: slugify(data.name),
      },
    })
  }

  static async create(
    data: Omit<Presentation, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Presentation> {
    return await prisma.presentation.create({
      data,
    })
  }

  static async update(
    id: string,
    data: Partial<Presentation>,
  ): Promise<Presentation> {
    return await prisma.presentation.update({
      where: { id },
      data,
    })
  }

  static async remove(id: string): Promise<Presentation> {
    return await prisma.presentation.delete({
      where: { id },
    })
  }
}
