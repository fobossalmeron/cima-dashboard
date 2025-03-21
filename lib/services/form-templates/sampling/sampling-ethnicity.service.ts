import { prisma } from '@/lib/prisma'
import { CreateOrUpdateSamplingData } from '@/types/services/sampling.types'
import { Prisma } from '@prisma/client'
import { FormTemplateWithQuestionsAndOptions } from '../form-template.service'
import { QuestionWithOptions } from '@/types/api'
import { SamplingFieldsEnum } from '@/enums/sampling-fields'
import { slugify } from '@/lib/utils'

export class SamplingEthnicityService {
  static async getBySlug(slug: string) {
    return await prisma.ethnicity.findUnique({ where: { slug } })
  }

  static async createOrUpdate(
    data: CreateOrUpdateSamplingData,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? prisma

    return await client.ethnicity.upsert({
      where: { slug: data.slug },
      update: { description: data.description },
      create: { slug: data.slug, description: data.description },
    })
  }

  static async processOptions(
    template: FormTemplateWithQuestionsAndOptions,
    tx: Prisma.TransactionClient,
  ) {
    const ethnicityQuestion = template.questions.find(
      (q) => q.name === SamplingFieldsEnum.ETHNICITY,
    ) as QuestionWithOptions

    if (!ethnicityQuestion) {
      throw new Error('No se encontró la pregunta de etnia')
    }

    const options = ethnicityQuestion.options

    for (const option of options) {
      await SamplingEthnicityService.createOrUpdate(
        {
          slug: slugify(option.value.toLowerCase()),
          description: option.value,
        },
        tx,
      )
    }
  }
}
