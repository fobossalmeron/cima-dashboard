import { prisma } from '@/lib/prisma'
import { SubBrandWithBrand } from '@/types/api'
import { SubBrand } from '@prisma/client'

export class SubBrandsService {
  static async getAll(): Promise<SubBrand[]> {
    return await prisma.subBrand.findMany()
  }

  static async getById(id: string): Promise<SubBrand | null> {
    return await prisma.subBrand.findUnique({
      where: { id },
    })
  }

  static async getBySlug(slug: string): Promise<SubBrandWithBrand | null> {
    return await prisma.subBrand.findUnique({
      where: { slug },
      include: {
        brand: true,
      },
    })
  }

  static async createOrUpdate(data: {
    name: string
    slug: string
    brandId: string
  }): Promise<SubBrandWithBrand> {
    return await prisma.subBrand.upsert({
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
      include: {
        brand: true,
      },
    })
  }

  static async create(
    data: Omit<SubBrand, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<SubBrand> {
    return await prisma.subBrand.create({
      data,
    })
  }

  static async update(id: string, data: Partial<SubBrand>): Promise<SubBrand> {
    return await prisma.subBrand.update({
      where: { id },
      data,
    })
  }

  static async remove(id: string): Promise<SubBrand> {
    return await prisma.subBrand.delete({
      where: { id },
    })
  }
}
