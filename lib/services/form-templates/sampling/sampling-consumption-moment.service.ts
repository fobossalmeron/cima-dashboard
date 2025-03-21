import { prisma } from '@/lib/prisma'
import { CreateOrUpdateSamplingData } from '@/types/services/sampling.types'
import { Prisma } from '@prisma/client'
import { FormTemplateWithQuestionsAndOptions } from '../form-template.service'
import { SamplingFieldsEnum } from '@/enums/sampling-fields'
import { QuestionWithOptions } from '@/types/api'
import { slugify } from '@/lib/utils'

export class SamplingConsumptionMomentService {
  static async getBySlug(slug: string) {
    return await prisma.consumptionMoment.findUnique({ where: { slug } })
  }

  static async createOrUpdate(
    data: CreateOrUpdateSamplingData,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? prisma
    return await client.consumptionMoment.upsert({
      where: { slug: data.slug },
      update: { description: data.description },
      create: { slug: data.slug, description: data.description },
    })
  }

  static async processOptions(
    template: FormTemplateWithQuestionsAndOptions,
    tx: Prisma.TransactionClient,
  ) {
    const consumptionMomentQuestion = template.questions.find(
      (q) => q.name === SamplingFieldsEnum.CONSUMPTION_MOMENT,
    ) as QuestionWithOptions

    if (!consumptionMomentQuestion) {
      throw new Error('No se encontró la pregunta de momento de consumo')
    }

    const options = consumptionMomentQuestion.options

    for (const option of options) {
      await SamplingConsumptionMomentService.createOrUpdate(
        {
          slug: slugify(option.value.toLowerCase()),
          description: option.value,
        },
        tx,
      )
    }
  }
}
