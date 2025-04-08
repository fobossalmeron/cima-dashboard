import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export class ProductSalesRepository {
  static async getProductSales(submissionId: string) {
    return await prisma.productSale.findMany({ where: { submissionId } })
  }

  static async create(
    productSale: Prisma.ProductSaleCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? prisma
    return await client.productSale.create({ data: productSale })
  }

  static async deleteByProductAndSubmission(
    productId: string,
    submissionId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? prisma
    return await client.productSale.deleteMany({
      where: { productId, submissionId },
    })
  }
}
