import { Prisma } from '@prisma/client'
import {
  AnswerValue,
  ProcessAnswersResponse,
  QuestionWithRelations,
  ValidationError,
} from '@/types/api'
import { QuestionSyncService } from './question.service'

export class AnswerSyncService {
  static processAnswers(
    questionAnswers: Record<string, string | number | null>,
    questionMap: Map<string, QuestionWithRelations>,
    activeQuestions: Set<string>,
    rowIndex: number,
  ): ProcessAnswersResponse {
    const errors: ValidationError[] = []
    const answers: AnswerValue[] = []

    Object.entries(questionAnswers).forEach(([key, value]) => {
      try {
        const question = questionMap.get(key)
        if (!question) {
          throw new Error(`No se encontró la pregunta para la columna: ${key}`)
        }

        // Verificar si la pregunta está activa
        if (!activeQuestions.has(question.id)) {
          return null
        }

        // Validar y procesar el valor según el tipo de pregunta
        const processedValue = QuestionSyncService.processQuestionValue(
          question,
          value,
        )
        answers.push(processedValue)
      } catch (error) {
        errors.push({
          row: rowIndex + 1,
          column: key,
          error: error instanceof Error ? error.message : 'Error desconocido',
        })
        return null
      }
    })

    return { answers, errors }
  }

  static async createAnswers(
    tx: Prisma.TransactionClient,
    submissionId: string,
    validAnswers: AnswerValue[],
  ) {
    try {
      // Crear las respuestas en la base de datos
      const answers = await tx.answer.createManyAndReturn({
        data: validAnswers.map((answer) => ({
          value: answer.value?.toString() ?? '',
          questionId: answer.questionId,
          optionId: answer.optionId,
          submissionId,
          questionKey: answer.questionKey,
        })),
      })

      // Crear las relaciones de opciones múltiples
      for (const answer of answers) {
        const answerValue = validAnswers.find(
          (va) => va.questionId === answer.questionId,
        )
        if (answerValue?.selectedOptionIds?.length) {
          await tx.answerOption.createMany({
            data: answerValue.selectedOptionIds.map((optionId) => ({
              answerId: answer.id,
              optionId,
            })),
          })
        }
      }

      return answers
    } catch (error) {
      console.error('Answers creation failed:', error)
      throw error
    }
  }
}
