import { prisma } from '@/lib/prisma'
import { CreateOrUpdateSamplingData } from '@/types/services/sampling.types'
import { Prisma } from '@prisma/client'
import { FormTemplateWithQuestionsAndOptions } from '../form-template.service'
import { SamplingFieldsEnum } from '@/enums/sampling-fields'
import { QuestionWithOptions } from '@/types/api'
import { slugify } from '@/lib/utils'

export class SamplingPurchaseIntentionService {
  static async getBySlug(slug: string) {
    return await prisma.purchaseIntention.findUnique({ where: { slug } })
  }

  static async createOrUpdate(
    data: CreateOrUpdateSamplingData,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? prisma
    return await client.purchaseIntention.upsert({
      where: { slug: data.slug },
      update: { description: data.description },
      create: { slug: data.slug, description: data.description },
    })
  }

  static async processOptions(
    template: FormTemplateWithQuestionsAndOptions,
    tx: Prisma.TransactionClient,
  ) {
    const purchaseIntentionQuestion = template.questions.find(
      (q) => q.name === SamplingFieldsEnum.PURCHASE_INTENTION,
    ) as QuestionWithOptions

    if (!purchaseIntentionQuestion) {
      throw new Error('No se encontró la pregunta de intención de compra')
    }

    const options = purchaseIntentionQuestion.options

    for (const option of options) {
      await SamplingPurchaseIntentionService.createOrUpdate(
        {
          slug: slugify(option.value.toLowerCase()),
          description: option.value,
        },
        tx,
      )
    }
  }
}
