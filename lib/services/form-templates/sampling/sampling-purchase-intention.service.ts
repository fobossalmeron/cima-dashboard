import { Prisma } from '@prisma/client'
import { FormTemplateWithQuestionsAndOptions } from '../form-template.service'
import { SamplingFieldsEnum } from '@/enums/sampling-fields'
import { QuestionWithOptions } from '@/types/api'
import { slugify } from '@/lib/utils'
import { PurchaseIntentionRepository } from '@/lib/repositories'

export class SamplingPurchaseIntentionService {
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
      await PurchaseIntentionRepository.createOrUpdate(
        {
          slug: slugify(option.value.toLowerCase()),
          description: option.value,
        },
        tx,
      )
    }
  }
}
