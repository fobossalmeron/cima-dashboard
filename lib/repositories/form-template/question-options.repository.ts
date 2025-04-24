import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export class QuestionOptionsRepository {
  static async create(
    data: Prisma.QuestionOptionCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? prisma
    return client.questionOption.create({
      data,
      include: { question: true },
    })
  }

  static async createOrUpdate(
    data: Prisma.QuestionOptionCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? prisma
    const { id, ...rest } = data
    return client.questionOption.upsert({
      where: { id },
      update: rest,
      create: data,
    })
  }

  static async findByValue(questionId: string, value: string) {
    return prisma.questionOption.findFirst({
      where: { questionId, value },
    })
  }

  static async findByQuestionId(questionId: string) {
    return prisma.questionOption.findMany({ where: { questionId } })
  }
}
