import { Prisma } from '@prisma/client'
import { SamplingFieldsEnum } from '@/enums/sampling-fields'
import {
  FormTemplateWithQuestionsAndOptions,
  QuestionWithOptions,
} from '@/types/api'
import { slugify } from '@/lib/utils'
import { SamplingTrafficRepository } from '@/lib/repositories/dashboard/sampling/traffic.repository'

export class SamplingTrafficService {
  static async processOptions(
    template: FormTemplateWithQuestionsAndOptions,
    tx: Prisma.TransactionClient,
  ) {
    const trafficQuestion = template.questions.find(
      (q) => q.name === SamplingFieldsEnum.TRAFFIC,
    ) as QuestionWithOptions

    if (!trafficQuestion) {
      throw new Error('No se encontró la pregunta de tráfico')
    }

    const options = trafficQuestion.options

    for (const option of options) {
      await SamplingTrafficRepository.createOrUpdate(
        {
          slug: slugify(option.value.toLowerCase()),
          description: option.value,
        },
        tx,
      )
    }
  }
}
