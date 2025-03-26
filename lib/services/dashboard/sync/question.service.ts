import { FormSubmissionEntryData, QuestionWithRelations } from '@/types/api'
import { QuestionType } from '@prisma/client'
import { AnswerValue } from '@/types/api'
import { AnswerSyncService } from './answer.service'
export class QuestionSyncService {
  /**
   * Get the active questions from the current row
   * @param {FormSubmissionEntryData} row - The current row of the form submission
   * @param {QuestionWithRelations[]} questions - The questions to process
   * @returns {Set<string>} A set of active question IDs
   */
  static getActiveQuestions(
    row: FormSubmissionEntryData,
    questions: QuestionWithRelations[],
  ): Set<string> {
    const activeQuestions = new Set<string>()
    const activeGroups = new Set<string>()
    const processedQuestions = new Set<string>()
    // Filter question answers from current row
    const questionAnswers = AnswerSyncService.filterQuestionAnswers(row)

    // Process all initial answers
    Object.entries(questionAnswers).forEach(([questionName, answer]) => {
      this.activateQuestionsRecursively({
        questionName,
        answer,
        questions,
        answers: questionAnswers,
        activeQuestions,
        activeGroups,
        processedQuestions,
      })
    })

    return activeQuestions
  }

  /**
   * Activate questions recursively based on the answer
   * @param {Object} params - The parameters for the recursive activation
   * @param {string} params.questionName - The name of the question
   * @param {string | number | null} params.answer - The answer to the question
   * @param {QuestionWithRelations[]} params.questions - The questions to process
   * @param {Record<string, string | number | null>} params.answers - The answers to the questions
   * @param {Set<string>} params.activeQuestions - The active questions
   * @param {Set<string>} params.activeGroups - The active groups
   * @param {Set<string>} params.processedQuestions - The processed questions
   */
  private static activateQuestionsRecursively({
    questionName,
    answer,
    questions,
    answers,
    activeQuestions,
    activeGroups,
    processedQuestions,
  }: {
    questionName: string
    answer: string | number | null
    questions: QuestionWithRelations[]
    answers: Record<string, string | number | null>
    activeQuestions: Set<string>
    activeGroups: Set<string>
    processedQuestions: Set<string>
  }): void {
    // Evitar procesar la misma pregunta múltiples veces
    if (processedQuestions.has(questionName)) return
    processedQuestions.add(questionName)

    const question = questions.find(
      (q) => q.name.trim() === questionName.trim(),
    )
    if (!question) {
      return
    }

    // Activar la pregunta actual solo si tiene una respuesta válida
    if (answer !== null && answer !== undefined) {
      activeQuestions.add(question.id)
    }

    // Si no hay respuesta o no hay triggers, no hay más que procesar
    if (!answer || !question.triggers.length) return

    // Procesar los triggers de la pregunta
    question.triggers.forEach((trigger) => {
      if (!trigger.group || !trigger.option) return

      const answerValues = answer.toString().split(' | ')

      const isTriggered = answerValues.some(
        (value) =>
          value.toString().toLowerCase() ===
          trigger.option?.value.toLowerCase(),
      )

      if (!isTriggered) return

      // Activar el grupo
      activeGroups.add(trigger.group.id)

      // Encontrar y procesar todas las preguntas del grupo activado
      const groupQuestions = questions.filter(
        (q) => q.questionGroupId === trigger.group?.id,
      )

      groupQuestions.forEach((groupQuestion) => {
        const groupQuestionAnswer = answers[groupQuestion.name]

        // Solo activar y procesar la pregunta si tiene una respuesta válida
        if (groupQuestionAnswer !== null && groupQuestionAnswer !== undefined) {
          activeQuestions.add(groupQuestion.id)

          // Procesar recursivamente la respuesta de esta pregunta
          this.activateQuestionsRecursively({
            questionName: groupQuestion.name,
            answer: groupQuestionAnswer,
            questions,
            answers,
            activeQuestions,
            activeGroups,
            processedQuestions,
          })
        }
      })
    })
  }

  /**
   * Process the value of a question
   * @param {QuestionWithRelations} question - The question to process
   * @param {string | number | null} value - The value to process
   * @returns {AnswerValue} The processed value
   */
  static processQuestionValue(
    question: QuestionWithRelations,
    value: string | number | null,
  ): AnswerValue {
    const isCheckbox = question.type === QuestionType.CHECKBOX
    const parsedValue = isCheckbox ? this.parseCheckboxValue(value) : value
    if (parsedValue === null || parsedValue === undefined) {
      if (question.isMandatory) {
        throw new Error(`La pregunta ${question.name} es obligatoria`)
      }
      return {
        value: null,
        questionKey: question.name,
        questionId: question.id,
        optionId: null,
      }
    }

    switch (question.type) {
      case QuestionType.SELECT: {
        const valueStr = parsedValue.toString()
        const option = question.options.find(
          (opt) => opt.value.toLowerCase() === valueStr.toLowerCase(),
        )
        if (!option) {
          throw new Error(
            `Valor inválido "${value}" para la pregunta ${
              question.name
            }. Opciones válidas: ${question.options
              .map((opt) => opt.value)
              .join(', ')}`,
          )
        }
        return {
          value: option.value,
          questionKey: question.name,
          questionId: question.id,
          optionId: option.id,
        }
      }
      case QuestionType.MULTISELECT: {
        const selectedValues = parsedValue.toString().split(' | ') || []
        const validOptions = selectedValues.map((selectedValue) => {
          const option = question.options.find(
            (opt) =>
              opt.value.toLowerCase() === selectedValue.trim().toLowerCase(),
          )
          if (!option) {
            throw new Error(
              `Valor inválido "${selectedValue}" para la pregunta ${
                question.name
              }. Opciones válidas: ${question.options
                .map((opt) => opt.value)
                .join(', ')}`,
            )
          }
          return option
        })

        return {
          value: validOptions.map((opt) => opt.value).join(' | '),
          questionKey: question.name,
          questionId: question.id,
          optionId: null,
          selectedOptionIds: validOptions.map((opt) => opt.id),
        }
      }
      case QuestionType.NUMERIC:
        const numValue = Number(value)
        if (isNaN(numValue)) {
          throw new Error(
            `El valor "${value}" no es un número válido para la pregunta ${question.name}`,
          )
        }
        return {
          value: numValue,
          questionKey: question.name,
          questionId: question.id,
          optionId: null,
        }
      case QuestionType.DATE:
        const date = new Date(parsedValue as string)
        if (isNaN(date.getTime())) {
          throw new Error(
            `El valor "${parsedValue}" no es una fecha válida para la pregunta ${question.name}`,
          )
        }
        return {
          value: date.toISOString(),
          questionKey: question.name,
          questionId: question.id,
          optionId: null,
        }
      default:
        return {
          value: parsedValue.toString(),
          questionKey: question.name,
          questionId: question.id,
          optionId: null,
        }
    }
  }

  /**
   * Parse the value of a checkbox question
   * @param {string | number | null} value - The value to parse
   * @returns {boolean} The parsed value
   */
  private static parseCheckboxValue(value: string | number | null): boolean {
    return value === 'Yes'
  }
}
