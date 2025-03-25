import { PresentationsEnum } from '@/enums/presentations'
import { SubBrandsEnum } from '@/enums/sub-brands'
import { prisma } from '@/lib/prisma'
import { Prisma, Product } from '@prisma/client'

export class ProductsService {
  static async getAll(tx?: Prisma.TransactionClient): Promise<Product[]> {
    const client = tx || prisma
    return await client.product.findMany({
      include: {
        brand: true,
        subBrand: true,
        presentation: true,
        flavor: true,
      },
    })
  }

  static async getById(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Product | null> {
    const client = tx || prisma
    return await client.product.findUnique({
      where: { id },
      include: {
        brand: true,
        subBrand: true,
        presentation: true,
        flavor: true,
      },
    })
  }

  static async create(
    data: {
      name: string
      brandId: string
      subBrandId: string | null
      presentationId: string
      flavorId: string
      imageUrl: string | null
    },
    tx?: Prisma.TransactionClient,
  ): Promise<Product> {
    const client = tx || prisma
    return await client.product.create({
      data,
      include: {
        brand: true,
        subBrand: true,
        presentation: true,
        flavor: true,
      },
    })
  }

  static async createOrUpdate(
    data: {
      name: string
      brandId: string
      subBrandId: string | null
      presentationId: string
      flavorId: string
      imageUrl: string | null
    },
    tx?: Prisma.TransactionClient,
  ): Promise<Product> {
    const client = tx || prisma
    const product = await client.product.findFirst({
      where: {
        brandId: data.brandId,
        subBrandId: data.subBrandId,
        presentationId: data.presentationId,
        flavorId: data.flavorId,
        name: data.name,
      },
    })

    if (product) {
      return await client.product.update({
        where: { id: product.id },
        data,
      })
    }

    return await client.product.create({
      data,
    })
  }

  static async update(
    id: string,
    data: Partial<Product>,
    tx?: Prisma.TransactionClient,
  ): Promise<Product> {
    const client = tx || prisma
    return await client.product.update({
      where: { id },
      data,
      include: {
        brand: true,
        subBrand: true,
        presentation: true,
        flavor: true,
      },
    })
  }

  static async remove(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Product> {
    const client = tx || prisma
    return await client.product.delete({
      where: { id },
      include: {
        brand: true,
        subBrand: true,
        presentation: true,
        flavor: true,
      },
    })
  }

  static generateProductName(
    brand: string,
    subBrand: string | null,
    presentation: string,
    flavor: string,
  ): string {
    const parts = [brand]
    if (subBrand && subBrand !== SubBrandsEnum.NOT_SPECIFIED)
      parts.push(subBrand)
    parts.push(presentation)
    if (flavor && flavor !== PresentationsEnum.NOT_SPECIFIED) parts.push(flavor)
    return parts.join(' - ')
  }
}
