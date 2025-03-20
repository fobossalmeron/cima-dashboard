import { prisma } from '@/lib/prisma'
import { Answer, Prisma } from '@prisma/client'

export class AnswerService {
  static async getAll() {
    return await prisma.answer.findMany()
  }

  static async getById(id: string) {
    return await prisma.answer.findUnique({ where: { id } })
  }

  static async getByDashboardId(dashboardId: string) {
    return await prisma.answer.findMany({
      where: { submission: { dashboardId } },
    })
  }

  static async getBySubmissionId(submissionId: string) {
    return await prisma.answer.findMany({ where: { submissionId } })
  }

  static async getByQuestionId(questionId: string) {
    return await prisma.answer.findMany({ where: { questionId } })
  }

  static async create(data: Answer) {
    return await prisma.answer.create({ data })
  }

  static async delete(id: string, tx?: Prisma.TransactionClient) {
    const client = tx || prisma
    return await client.answer.delete({ where: { id } })
  }

  static async deleteByDashboardId(
    dashboardId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || prisma
    await client.answerOption.deleteMany({
      where: { answer: { submission: { dashboardId } } },
    })
    return await client.answer.deleteMany({
      where: { submission: { dashboardId } },
    })
  }

  static async deleteBySubmissionId(
    submissionId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || prisma
    return await client.answer.deleteMany({ where: { submissionId } })
  }

  static async deleteByQuestionId(
    questionId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || prisma
    return await client.answer.deleteMany({ where: { questionId } })
  }
}
