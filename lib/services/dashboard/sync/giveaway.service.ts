import { GiveawayProduct, Prisma } from '@prisma/client'
import {
  GiveawaysColumnsEnum,
  GiveawaysColumnsValues,
} from '@/enums/giveaways-column'
import { DataFieldSearchType } from '@/enums/data-fields'
import { slugify, calculateStringSimilarity } from '@/lib/utils'
import {
  GiveawayProductTypeRepository,
  GiveawayProductRepository,
} from '@/lib/repositories'
import {
  ProcessGiveaway,
  ProcessGiveawayRowParams,
  ProcessGiveawayRowResponse,
} from '@/types/services'

export class GiveawayService {
  private static async processGiveaway(
    data: ProcessGiveaway,
    tx?: Prisma.TransactionClient,
  ) {
    const { value, submissionId, quantity } = data
    const name = value as string
    const slug = slugify(name.toLowerCase())
    // Create or update giveaway product type
    const giveawayProductType =
      await GiveawayProductTypeRepository.createOrUpdate(name, slug, tx)

    // Create giveaway product
    return await GiveawayProductRepository.createOrUpdate(
      {
        giveawayProductTypeId: giveawayProductType.id,
        submissionId: submissionId,
        quantity: quantity,
      },
      tx,
    )
  }

  static async processRow(
    data: ProcessGiveawayRowParams,
    tx?: Prisma.TransactionClient,
  ): Promise<ProcessGiveawayRowResponse> {
    const { submissionId, row, questionsMap } = data
    const giveawayQuestion: [string, unknown] | undefined = Object.entries(
      row,
    ).find(([key]) => {
      const { tags, searchType } =
        GiveawaysColumnsValues[GiveawaysColumnsEnum.ENTRY_COLUMN]
      switch (searchType) {
        case DataFieldSearchType.OR:
          return tags.some((tag) => key.includes(tag))
        case DataFieldSearchType.AND:
          return tags.every((tag) => key.includes(tag))
      }
    })

    if (!giveawayQuestion) {
      throw new Error('Giveaway question not found')
    }

    const giveawayTemplateQuestion = questionsMap.get(giveawayQuestion[0])

    if (!giveawayTemplateQuestion) {
      throw new Error('Giveaway template question not found')
    }

    const triggeredQuestions = giveawayTemplateQuestion.triggers
      ?.map((trigger) => trigger?.group?.questions)
      .filter((questions) => questions !== undefined)
      .flat()

    const giveawayQuestionValues = (giveawayQuestion[1] as string).split(' | ')

    const giveawayProducts: GiveawayProduct[] = []

    for (const value of giveawayQuestionValues) {
      const triggeredQuestion = triggeredQuestions.find((question) => {
        const questionValue = question.name
          .replace(/UNIDADES de /i, '')
          .replace(/UNIDADES DE /i, '')
          .replace('Unidades de ', '')
          .replace(/UNIDADES/i, '')
          .trim()
        const similarity = calculateStringSimilarity(value, questionValue)
        return similarity >= 0.6 // Umbral de similitud del 60%
      })
      if (triggeredQuestion) {
        const triggeredQuestionValue = row[triggeredQuestion.name]
        if (triggeredQuestionValue) {
          const giveawayProduct = await this.processGiveaway(
            {
              value,
              submissionId,
              quantity: Number(triggeredQuestionValue),
            },
            tx,
          )
          giveawayProducts.push(giveawayProduct)
        }
      }
    }

    return { giveawayProducts }
  }
}
