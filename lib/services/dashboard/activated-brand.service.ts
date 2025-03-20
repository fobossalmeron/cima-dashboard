import { prisma } from '@/lib/prisma'
import { ActivatedBrand, Brand, Prisma } from '@prisma/client'

export class ActivatedBrandService {
  static async getAll() {
    return await prisma.activatedBrand.findMany()
  }

  static async getById(id: string) {
    return await prisma.activatedBrand.findUnique({ where: { id } })
  }

  static async getByDashboardId(dashboardId: string): Promise<Brand[]> {
    return await prisma.brand.findMany({
      where: {
        activations: {
          some: {
            submission: {
              dashboardId,
            },
          },
        },
      },
      distinct: ['id'],
      orderBy: {
        name: 'asc',
      },
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

  static async create(
    data: Omit<ActivatedBrand, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    return await prisma.activatedBrand.create({
      data,
    })
  }

  static async delete(id: string, tx?: Prisma.TransactionClient) {
    const client = tx || prisma
    return await client.activatedBrand.delete({ where: { id } })
  }

  static async deleteByDashboardId(
    dashboardId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const prismaClient = tx || prisma
    await prismaClient.activatedBrand.deleteMany({
      where: {
        submission: {
          dashboardId,
        },
      },
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

  static async update(id: string, data: Partial<ActivatedBrand>) {
    return await prisma.activatedBrand.update({
      where: { id },
      data,
    })
  }

  static async remove(id: string) {
    return await prisma.activatedBrand.delete({
      where: { id },
    })
  }
}
