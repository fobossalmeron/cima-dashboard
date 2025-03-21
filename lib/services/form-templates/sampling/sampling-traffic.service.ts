import { prisma } from '@/lib/prisma'
import { CreateOrUpdateSamplingData } from '@/types/services/sampling.types'
import { Prisma } from '@prisma/client'
import { FormTemplateWithQuestionsAndOptions } from '../form-template.service'
import { SamplingFieldsEnum } from '@/enums/sampling-fields'
import { QuestionWithOptions } from '@/types/api'
import { slugify } from '@/lib/utils'

export class SamplingTrafficService {
  static async getAll() {
    return await prisma.samplingTraffic.findMany()
  }

  static async getBySlug(slug: string) {
    return await prisma.samplingTraffic.findUnique({ where: { slug } })
  }

  static async createOrUpdate(
    data: CreateOrUpdateSamplingData,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? prisma
    return await client.samplingTraffic.upsert({
      where: { slug: data.slug },
      update: { description: data.description },
      create: { slug: data.slug, description: data.description },
    })
  }

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
      await SamplingTrafficService.createOrUpdate(
        {
          slug: slugify(option.value.toLowerCase()),
          description: option.value,
        },
        tx,
      )
    }
  }
}
