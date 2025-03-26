import { Prisma } from '@prisma/client'
import { FormTemplateWithQuestionsAndOptions } from '../form-template.service'
import { SamplingFieldsEnum } from '@/enums/sampling-fields'
import { QuestionWithOptions } from '@/types/api'
import { slugify } from '@/lib/utils'
import { SamplingAgeRangeRepository } from '@/lib/repositories'
export class SamplingAgeRangeService {
  static async processOptions(
    template: FormTemplateWithQuestionsAndOptions,
    tx: Prisma.TransactionClient,
  ) {
    const ageRangeQuestion = template.questions.find(
      (q) => q.name === SamplingFieldsEnum.AGE_RANGE,
    ) as QuestionWithOptions

    if (!ageRangeQuestion) {
      throw new Error('No se encontró la pregunta de rango de edad')
    }

    const options = ageRangeQuestion.options

    for (const option of options) {
      await SamplingAgeRangeRepository.createOrUpdate(
        {
          slug: slugify(option.value.toLowerCase()),
          description: option.value,
        },
        tx,
      )
    }
  }
}
