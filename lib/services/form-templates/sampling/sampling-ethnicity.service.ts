import { Prisma } from '@prisma/client'
import {
  FormTemplateWithQuestionsAndOptions,
  QuestionWithOptions,
} from '@/types/api'
import { SamplingFieldsEnum } from '@/enums/sampling-fields'
import { slugify } from '@/lib/utils'
import { SamplingEthnicityRepository } from '@/lib/repositories'

export class SamplingEthnicityService {
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
      await SamplingEthnicityRepository.createOrUpdate(
        {
          slug: slugify(option.value.toLowerCase()),
          description: option.value,
        },
        tx,
      )
    }
  }
}
