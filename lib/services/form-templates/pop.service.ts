import { PopQuestionsEnum, PopQuestionsValues } from '@/enums/pop-questions'
import { PopTypeRepository } from '@/lib/repositories'
import { slugify } from '@/lib/utils'
import { QuestionsUtils } from '@/lib/utils/questions-utils'
import { QuestionWithRelations } from '@/types/prisma'
import { PhotoType, PopType, Prisma } from '@prisma/client'

export class PopService {
  static async syncTypes(
    questions: QuestionWithRelations[],
    tx: Prisma.TransactionClient,
  ): Promise<PopType[]> {
    const { tags, searchType } =
      PopQuestionsValues[PopQuestionsEnum.TYPE_COLUMN]

    const popTypeQuestion = QuestionsUtils.searchQuestion(
      questions,
      tags,
      searchType,
    )

    if (!popTypeQuestion.length) {
      throw new Error('Pop type question not found')
    }

    const question = popTypeQuestion[0]

    const options = question.options.map((option) => option.value)

    return await Promise.all(
      options.map(async (option) => {
        const slug = slugify(option)
        const popType = await PopTypeRepository.createOrUpdate(
          {
            slug,
            description: option,
          },
          tx,
        )

        return popType
      }),
    )
  }

  static async syncPhotoType(
    tx?: Prisma.TransactionClient,
  ): Promise<PhotoType> {
    return await PopTypeRepository.createOrUpdatePhotoType(
      { slug: 'pop', description: 'Foto Material POP' },
      tx,
    )
  }
}
