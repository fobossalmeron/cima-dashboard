import { Answer, AnswerOption } from '@prisma/client'

export interface AnswerWithOptions extends Answer {
  selectedOptions: AnswerOption[]
}
