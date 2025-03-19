import { prisma } from '@/lib/prisma'
import { FormSubmission, Prisma } from '@prisma/client'

export class SubmissionService {
  static async getAll() {
    return await prisma.formSubmission.findMany()
  }

  static async getById(id: string) {
    return await prisma.formSubmission.findUnique({ where: { id } })
  }

  static async getByDashboardId(dashboardId: string) {
    return await prisma.formSubmission.findMany({ where: { dashboardId } })
  }

  static async getBySubmissionId(submissionId: string) {
    return await prisma.formSubmission.findUnique({
      where: { id: submissionId },
    })
  }

  static async create(data: FormSubmission) {
    return await prisma.formSubmission.create({ data })
  }

  static async delete(id: string, tx?: Prisma.TransactionClient) {
    const client = tx || prisma
    return await client.formSubmission.delete({ where: { id } })
  }

  static async deleteByDashboardId(
    dashboardId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || prisma
    return await client.formSubmission.deleteMany({ where: { dashboardId } })
  }
}
