import { prisma } from '@/lib/prisma'
import { ProductMetrics } from '@prisma/client'

export class ProductMetricsService {
  static async getAll(): Promise<ProductMetrics[]> {
    return await prisma.productMetrics.findMany({
      include: {
        product: {
          include: {
            brand: true,
            subBrand: true,
            presentation: true,
            flavor: true,
          },
        },
      },
    })
  }

  static async getById(id: string): Promise<ProductMetrics | null> {
    return await prisma.productMetrics.findUnique({
      where: { id },
      include: {
        product: {
          include: {
            brand: true,
            subBrand: true,
            presentation: true,
            flavor: true,
          },
        },
      },
    })
  }

  static async create(
    data: Omit<ProductMetrics, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ProductMetrics> {
    return await prisma.productMetrics.create({
      data,
      include: {
        product: {
          include: {
            brand: true,
            subBrand: true,
            presentation: true,
            flavor: true,
          },
        },
      },
    })
  }

  static async update(
    id: string,
    data: Partial<ProductMetrics>,
  ): Promise<ProductMetrics> {
    return await prisma.productMetrics.update({
      where: { id },
      data,
      include: {
        product: {
          include: {
            brand: true,
            subBrand: true,
            presentation: true,
            flavor: true,
          },
        },
      },
    })
  }

  static async remove(id: string): Promise<ProductMetrics> {
    return await prisma.productMetrics.delete({
      where: { id },
      include: {
        product: {
          include: {
            brand: true,
            subBrand: true,
            presentation: true,
            flavor: true,
          },
        },
      },
    })
  }

  static async getByProductId(productId: string): Promise<ProductMetrics[]> {
    return await prisma.productMetrics.findMany({
      where: { productId },
      include: {
        product: {
          include: {
            brand: true,
            subBrand: true,
            presentation: true,
            flavor: true,
          },
        },
      },
    })
  }
}
