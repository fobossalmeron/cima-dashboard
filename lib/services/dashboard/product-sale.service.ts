import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export class ProductSaleService {
  static async getProductSales(dashboardId: string) {
    return await prisma.productSale.findMany({
      where: { submission: { dashboardId } },
    })
  }

  static async getProductSalesByBrand(dashboardId: string, brandId: string) {
    return await prisma.productSale.findMany({
      where: { submission: { dashboardId }, product: { brandId } },
    })
  }

  static async getProductSalesByBrandAndSubBrand(
    dashboardId: string,
    brandId: string,
    subBrandId: string,
  ) {
    return await prisma.productSale.findMany({
      where: { submission: { dashboardId }, product: { brandId, subBrandId } },
    })
  }

  static async getProductSalesByBrandAndSubBrandAndFlavor(
    dashboardId: string,
    brandId: string,
    subBrandId: string,
    flavorId: string,
  ) {
    return await prisma.productSale.findMany({
      where: {
        submission: { dashboardId },
        product: { brandId, subBrandId, flavorId },
      },
    })
  }

  static async getProductSalesByBrandAndSubBrandAndFlavorAndPresentation(
    dashboardId: string,
    brandId: string,
    subBrandId: string,
    flavorId: string,
    presentationId: string,
  ) {
    return await prisma.productSale.findMany({
      where: {
        submission: { dashboardId },
        product: { brandId, subBrandId, flavorId, presentationId },
      },
    })
  }

  static async create(
    data: {
      submissionId: string
      productId: string
      quantity: number
      price: number
      total: number
    },
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || prisma
    return await client.productSale.create({ data })
  }

  static async deleteByDashboardId(
    dashboardId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || prisma
    return await client.productSale.deleteMany({
      where: { submission: { dashboardId } },
    })
  }
}
