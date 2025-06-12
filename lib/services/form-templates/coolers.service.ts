import {
  CoolersQuestionsEnum,
  CoolersQuestionsValues,
} from '@/enums/coolers-questions'
import { QuestionWithRelations } from '@/types/prisma'
import { CoolerSize, PhotoType, Prisma } from '@prisma/client'
import { QuestionsUtils } from '@/lib/utils/questions-utils'
import { slugify } from '@/lib/utils'
import { CoolerSizeRepository } from '@/lib/repositories'

export class CoolersService {
  static async syncSizes(
    questions: QuestionWithRelations[],
    tx: Prisma.TransactionClient,
  ): Promise<CoolerSize[]> {
    const { tags, searchType } =
      CoolersQuestionsValues[CoolersQuestionsEnum.TYPE_COLUMN]

    const coolerSizeQuestion = QuestionsUtils.searchQuestion(
      questions,
      tags,
      searchType,
    )

    if (!coolerSizeQuestion.length) {
      throw new Error('Cooler size question not found')
    }

    const question = coolerSizeQuestion[0]

    const options = question.options.map((option) => option.value)

    return await Promise.all(
      options.map(async (option) => {
        const slug = slugify(option)
        const coolerSize = await CoolerSizeRepository.createOrUpdate(
          {
            slug,
            description: option,
          },
          tx,
        )

        return coolerSize
      }),
    )
  }

  static async syncPhotoType(
    tx?: Prisma.TransactionClient,
  ): Promise<PhotoType> {
    return await CoolerSizeRepository.createOrUpdatePhotoType(
      {
        slug: 'cooler',
        description: 'Foto del Cooler',
      },
      tx,
    )
  }
}
