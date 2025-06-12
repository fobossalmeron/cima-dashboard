import { DataFieldSearchType } from '@/enums/data-fields'
import { FormSubmissionEntryData } from '@/types/api'
import { QuestionWithRelations } from '@/types/prisma'

export class QuestionsUtils {
  static searchQuestion(
    questions: QuestionWithRelations[],
    tags: string[],
    searchType: DataFieldSearchType,
  ): QuestionWithRelations[] {
    return questions.filter((question) => {
      const questionName = question.name.toLowerCase()
      switch (searchType) {
        case DataFieldSearchType.OR:
          return tags.some((tag) => questionName.includes(tag.toLowerCase()))
        case DataFieldSearchType.AND:
          return tags.every((tag) => questionName.includes(tag.toLowerCase()))
      }
    })
  }

  static searchQuestionInRow(
    row: FormSubmissionEntryData,
    tags: string[],
    searchType: DataFieldSearchType,
  ): string | number | null | undefined {
    return Object.entries(row).find(([key]) => {
      switch (searchType) {
        case DataFieldSearchType.OR:
          return tags.some((tag) => key.includes(tag))
        case DataFieldSearchType.AND:
          return tags.every((tag) => key.includes(tag))
      }
    })?.[1]
  }
}
