import { prisma } from '@/lib/prisma'
import { ActivatedBrand, Prisma } from '@prisma/client'

export class ActivatedBrandService {
  static async getAll() {
    return await prisma.activatedBrand.findMany()
  }

  static async getById(id: string) {
    return await prisma.activatedBrand.findUnique({ where: { id } })
  }

  static async getByDashboardId(dashboardId: string) {
    return await prisma.activatedBrand.findMany({
      where: { submission: { dashboardId } },
    })
  }

  static async getBySubmissionId(submissionId: string) {
    return await prisma.activatedBrand.findMany({
      where: { submissionId },
    })
  }

  static async getByBrandId(brandId: string) {
    return await prisma.activatedBrand.findMany({ where: { brandId } })
  }

  static async create(data: ActivatedBrand) {
    return await prisma.activatedBrand.create({ data })
  }

  static async delete(id: string, tx?: Prisma.TransactionClient) {
    const client = tx || prisma
    return await client.activatedBrand.delete({ where: { id } })
  }

  static async deleteByDashboardId(
    dashboardId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || prisma
    return await client.activatedBrand.deleteMany({
      where: { submission: { dashboardId } },
    })
  }

  static async deleteBySubmissionId(
    submissionId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || prisma
    return await client.activatedBrand.deleteMany({
      where: { submissionId },
    })
  }
}
