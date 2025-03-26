import { prisma } from '@/lib/prisma'
import { AnswerValue } from '@/types/api'
import { AnswerWithOptions } from '@/types/services'
import { AnswerOption, Prisma } from '@prisma/client'

export class AnswerRepository {
  /**
   * Create or update an answer
   * @param {AnswerValue} data - Answer data
   * @param {string} submissionId - Submission ID
   * @param {Prisma.TransactionClient} tx - Transaction client
   * @returns {Promise<AnswerWithOptions>} Answer with options
   */
  static async createOrUpdate(
    data: AnswerValue,
    submissionId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<AnswerWithOptions> {
    const client = tx ?? prisma
    const answerExists = await client.answer.findFirst({
      where: {
        submissionId,
        questionId: data.questionId,
      },
    })

    if (answerExists) {
      return await client.answer.update({
        where: { id: answerExists.id },
        data: {
          value: data.value?.toString() ?? '',
          optionId: data.optionId,
        },
        include: {
          selectedOptions: true,
        },
      })
    }

    return await client.answer.create({
      data: {
        value: data.value?.toString() ?? '',
        questionId: data.questionId,
        optionId: data.optionId,
        submissionId,
        questionKey: data.questionKey,
      },
      include: {
        selectedOptions: true,
      },
    })
  }

  /**
   * Create or update an answer option
   * @param {string} answerId - Answer ID
   * @param {string} optionId - Option ID
   * @param {Prisma.TransactionClient} tx - Transaction client
   * @returns {Promise<AnswerOption>} Answer option
   */
  static async createOrUpdateAnswerOption(
    answerId: string,
    optionId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<AnswerOption> {
    const client = tx ?? prisma
    const answerOptionExists = await client.answerOption.findFirst({
      where: {
        answerId,
        optionId,
      },
    })

    if (answerOptionExists) {
      return await client.answerOption.update({
        where: { id: answerOptionExists.id },
        data: {
          optionId,
        },
      })
    }

    return await client.answerOption.create({
      data: {
        answerId,
        optionId,
      },
    })
  }

  /**
   * Create answer options
   * @param {string} answerId - Answer ID
   * @param {AnswerValue} data - Answer data
   * @param {Prisma.TransactionClient} tx - Transaction client
   * @returns {Promise<AnswerOption[]>} Answer options
   */
  static async createOrUpdateAnswerOptions(
    answerId: string,
    data: AnswerValue,
    tx?: Prisma.TransactionClient,
  ): Promise<AnswerOption[]> {
    if (!data.selectedOptionIds) {
      return []
    }
    return await Promise.all(
      data.selectedOptionIds.map((optionId) =>
        this.createOrUpdateAnswerOption(answerId, optionId, tx),
      ),
    )
  }

  /**
   * Create answers
   * @param {AnswerValue[]} answerValues - Answer values
   * @param {string} submissionId - Submission ID
   * @param {Prisma.TransactionClient} tx - Transaction client
   * @returns {Promise<AnswerWithOptions[]>} Answers with options
   */
  static async createOrUpdateAnswers(
    answerValues: AnswerValue[],
    submissionId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<AnswerWithOptions[]> {
    const answersWithOptions: AnswerWithOptions[] = []
    for (const answerValue of answerValues) {
      const answer = await this.createOrUpdate(answerValue, submissionId, tx)
      const selectedOptions = await this.createOrUpdateAnswerOptions(
        answer.id,
        answerValue,
        tx,
      )
      answersWithOptions.push({ ...answer, selectedOptions })
    }

    return answersWithOptions
  }
}
