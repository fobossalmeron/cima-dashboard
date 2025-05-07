import { Prisma } from '@prisma/client'
import { SamplingFieldsEnum } from '@/enums/sampling-fields'
import {
  FormTemplateWithQuestionsAndOptions,
  QuestionWithOptions,
} from '@/types/api'
import { slugify } from '@/lib/utils'
import { SamplingGenderRepository } from '@/lib/repositories'
export class SamplingGenderService {
  static async processOptions(
    template: FormTemplateWithQuestionsAndOptions,
    tx: Prisma.TransactionClient,
  ) {
    const genderQuestion = template.questions.find(
      (q) => q.name === SamplingFieldsEnum.GENDER,
    ) as QuestionWithOptions

    if (!genderQuestion) {
      throw new Error('No se encontró la pregunta de género')
    }

    const options = genderQuestion.options

    for (const option of options) {
      await SamplingGenderRepository.createOrUpdate(
        {
          slug: slugify(option.value.toLowerCase()),
          description: option.value,
        },
        tx,
      )
    }
  }
}
