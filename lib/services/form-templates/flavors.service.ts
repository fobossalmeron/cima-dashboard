import { prisma } from '@/lib/prisma'
import { Flavor } from '@prisma/client'

export class FlavorsService {
  static async getAll(): Promise<Flavor[]> {
    return await prisma.flavor.findMany()
  }

  static async getById(id: string): Promise<Flavor | null> {
    return await prisma.flavor.findUnique({
      where: { id },
    })
  }

  static async createOrUpdate(data: {
    name: string
    slug: string
  }): Promise<Flavor> {
    return await prisma.flavor.upsert({
      where: {
        slug: data.slug,
      },
      update: {
        name: data.name,
      },
      create: {
        name: data.name,
        slug: data.slug,
      },
    })
  }
}
