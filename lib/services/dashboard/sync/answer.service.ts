import {
  AnswerValue,
  FormSubmissionEntryData,
  ProcessAnswersResponse,
  QuestionWithRelations,
  ValidationError,
} from '@/types/api'
import { QuestionSyncService } from './question.service'
import { GeneralFieldsEnum } from '@/enums/general-fields'
import { Prisma } from '@prisma/client'
import { AnswerRepository } from '@/lib/repositories'
import { AnswerWithOptions } from '@/types/services'
import { FormFieldsIgnoreEnum } from '@/enums/form-fields'

export class AnswerSyncService {
  /**
   * Filter question answers from current row
   * @param {FormSubmissionEntryData} row - Current row
   * @returns {FormSubmissionEntryData} Question answers
   */
  static filterQuestionAnswers(
    row: FormSubmissionEntryData,
  ): FormSubmissionEntryData {
    return Object.fromEntries(
      Object.entries(row).filter(
        ([key]) =>
          !Object.values(GeneralFieldsEnum).includes(
            key as GeneralFieldsEnum,
          ) &&
          !Object.values(FormFieldsIgnoreEnum).includes(
            key as FormFieldsIgnoreEnum,
          ),
      ),
    )
  }

  /**
   * Process answers
   * @param {FormSubmissionEntryData} row - Current row
   * @param {Record<string, string | number | null>} questionAnswers - Question answers
   * @param {Map<string, QuestionWithRelations>} questionMap - Question map
   * @param {Set<string>} activeQuestions - Active questions
   * @param {number} rowIndex - Row index
   * @returns {ProcessAnswersResponse} Process answers response
   */
  static processAnswers(
    row: FormSubmissionEntryData,
    questions: QuestionWithRelations[],
    questionMap: Map<string, QuestionWithRelations>,
    rowIndex: number,
  ): ProcessAnswersResponse {
    const errors: ValidationError[] = []
    const answers: AnswerValue[] = []

    const questionAnswers = this.filterQuestionAnswers(row)
    const activeQuestions = QuestionSyncService.getActiveQuestions(
      row,
      questions,
    )

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

    return { answers, errors, questionAnswers, activeQuestions }
  }

  /**
   * Create or update answers
   * @param {string} submissionId - Submission ID
   * @param {AnswerValue[]} answers - Answers
   * @param {Prisma.TransactionClient} tx - Transaction client
   * @returns {Promise<AnswerWithOptions[]>} Answers with options
   */
  static async createAnswers(
    submissionId: string,
    answers: AnswerValue[],
    tx?: Prisma.TransactionClient,
  ): Promise<AnswerWithOptions[]> {
    return Promise.all(
      answers.map((answer) =>
        AnswerRepository.createOrUpdate(answer, submissionId, tx),
      ),
    )
  }
}
