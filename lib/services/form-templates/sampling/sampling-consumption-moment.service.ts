import { Prisma } from '@prisma/client'
import { SamplingFieldsEnum } from '@/enums/sampling-fields'
import {
  FormTemplateWithQuestionsAndOptions,
  QuestionWithOptions,
} from '@/types/api'
import { slugify } from '@/lib/utils'
import { ConsumptionMomentRepository } from '@/lib/repositories'

export class SamplingConsumptionMomentService {
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
      await ConsumptionMomentRepository.createOrUpdate(
        {
          slug: slugify(option.value.toLowerCase()),
          description: option.value,
        },
        tx,
      )
    }
  }
}
