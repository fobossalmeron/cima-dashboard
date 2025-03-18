import { prisma } from '@/lib/prisma'
import {
  AnswerValue,
  FormSubmissionEntryData,
  ProcessAnswersResponse,
  QuestionWithRelations,
  RowTransactionErrorResult,
  RowTransactionResult,
  RowTransactionSkippedResult,
  RowTransactionSuccessResult,
} from '@/types/api'
import { Prisma, QuestionType } from '@prisma/client'
import { GeneralFieldsEnum } from '@/enums/general-fields'
import { DashboardsService } from './dashboards.service'
import { ValidationError, ValidationResult } from '@/types/api'
import { parseDate } from '@/lib/utils/date'
import { SyncStatus } from '@/enums/dashboard-sync'

export class DashboardSyncService {
  static async sync(
    id: string,
    formData: FormSubmissionEntryData[],
  ): Promise<ValidationResult> {
    const dashboard = await DashboardsService.getById(id)
    if (!dashboard) {
      throw new Error('Dashboard not found')
    }

    // Obtener todas las preguntas del template con sus relaciones
    const questions: QuestionWithRelations[] = await prisma.question.findMany({
      where: {
        formTemplateId: dashboard.templateId,
      },
      include: {
        options: true,
        questionGroup: true,
        triggers: {
          include: {
            option: true,
            group: true,
          },
        },
      },
    })

    // Crear un mapa de nombre de pregunta a pregunta para búsqueda rápida
    const questionMap = new Map<string, QuestionWithRelations>(
      questions.map((q) => [q.name.trim(), q]),
    )

    const validSubmissions: RowTransactionSuccessResult[] = []
    const invalidSubmissions: RowTransactionErrorResult[] = []
    const skippedSubmissions: RowTransactionSkippedResult[] = []
    // Procesar cada fila del CSV dentro de una transacción
    const rowsPromises = []
    for (const [rowIndex, row] of formData.entries()) {
      rowsPromises.push(
        this.processRow(id, row, rowIndex, questions, questionMap),
      )
    }

    await Promise.all(rowsPromises)
      .then((results) => {
        results.forEach((result) => {
          if (result.status === SyncStatus.SUCCESS) {
            validSubmissions.push(result)
          } else if (result.status === SyncStatus.SKIPPED) {
            skippedSubmissions.push(result)
          } else {
            invalidSubmissions.push(result)
          }
        })
      })
      .catch((error) => {
        throw error
      })

    return {
      validSubmissions,
      invalidSubmissions,
      skippedSubmissions,
    }
  }

  private static async processRow(
    dashboardId: string,
    row: FormSubmissionEntryData,
    rowIndex: number,
    questions: QuestionWithRelations[],
    questionMap: Map<string, QuestionWithRelations>,
  ): Promise<RowTransactionResult> {
    try {
      const result = await prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
          // Procesar campos generales dentro de la transacción
          const {
            dealerData,
            representativeData,
            locationData,
            submissionData,
            questionAnswers,
          } = await this.processGeneralFields(row, dashboardId)

          const dealer = await tx.dealer.create({
            data: dealerData,
          })

          const representative = await tx.representative.upsert({
            where: { id: representativeData.id },
            update: {
              name: representativeData.name,
            },
            create: representativeData,
          })

          const { id, ...locationDataWithoutId } = locationData

          const location = await tx.location.upsert({
            where: { id },
            update: locationDataWithoutId,
            create: locationData,
          })

          const submissionExists = await tx.formSubmission.findUnique({
            where: {
              dashboardId_locationId_representativeId_submittedAt: {
                dashboardId: dashboardId,
                locationId: location.id,
                representativeId: representative.id,
                submittedAt: submissionData.submittedAt,
              },
            },
          })

          if (submissionExists) {
            return {
              status: SyncStatus.SKIPPED,
              rowIndex: rowIndex + 1,
              submission: submissionExists,
            }
          }

          const submission = await tx.formSubmission.create({
            data: {
              ...submissionData,
              locationId: location.id,
              representativeId: representative.id,
            },
          })

          // Obtener las preguntas activas basadas en las respuestas
          const activeQuestions = this.getActiveQuestions(
            questionAnswers,
            questions,
          )

          // Procesar las respuestas y validar
          const { answers: validAnswers, errors } = this.processAnswers(
            questionAnswers,
            questionMap,
            activeQuestions,
            rowIndex,
          )

          // Si hay errores, lanzar excepción para hacer rollback
          if (errors.length > 0) {
            throw new Error(
              JSON.stringify({
                type: 'ValidationErrors',
                errors,
              }),
            )
          }

          // Crear las respuestas en la base de datos
          const answers = await tx.answer.createManyAndReturn({
            data: validAnswers.map((answer) => ({
              value: answer.value?.toString() ?? '',
              questionId: answer.questionId,
              optionId: answer.optionId,
              submissionId: submission.id,
              questionKey: answer.questionKey,
            })),
          })

          return {
            status: SyncStatus.SUCCESS,
            dashboardId,
            dealer,
            representative,
            location,
            submission,
            answers,
          }
        },
      )
      return result as RowTransactionResult
    } catch (error) {
      if (error instanceof Error) {
        try {
          // Intentar parsear errores de validación
          const parsedError = JSON.parse(error.message)
          if (parsedError.type === 'ValidationErrors') {
            return {
              status: SyncStatus.ERROR,
              rowIndex: rowIndex + 1,
              errors: parsedError.errors,
            }
          } else {
            return {
              status: SyncStatus.ERROR,
              rowIndex: rowIndex + 1,
              errors: [
                {
                  row: rowIndex + 1,
                  column: 'General',
                  error: error.message,
                },
              ],
            }
          }
        } catch {
          // Si no es un error de validación, crear error general
          return {
            status: SyncStatus.ERROR,
            rowIndex: rowIndex + 1,
            errors: [
              {
                row: rowIndex + 1,
                column: 'General',
                error: error.message,
              },
            ],
          }
        }
      } else {
        return {
          status: SyncStatus.ERROR,
          rowIndex: rowIndex + 1,
          errors: [
            {
              row: rowIndex + 1,
              column: 'General',
              error: 'Error desconocido',
            },
          ],
        }
      }
    }
  }

  private static getActiveQuestions(
    answers: Record<string, string | number | null>,
    questions: QuestionWithRelations[],
  ): Set<string> {
    const activeQuestions = new Set<string>()
    const activeGroups = new Set<string>()

    // Primera pasada: encontrar grupos activos basados en triggers
    questions.forEach((question) => {
      const answer = answers[question.name]
      if (answer) {
        question.triggers.forEach((trigger) => {
          if (trigger.group && trigger.option) {
            if (
              answer.toString().toLowerCase() ===
              trigger.option.value.toLowerCase()
            ) {
              activeGroups.add(trigger.group.id)
            }
          }
        })
      }
    })

    // Segunda pasada: determinar preguntas activas
    questions.forEach((question) => {
      if (
        !question.questionGroupId ||
        (question.questionGroup && activeGroups.has(question.questionGroup.id))
      ) {
        activeQuestions.add(question.id)
      }
    })

    return activeQuestions
  }

  private static parseCheckboxValue(value: string | number | null) {
    return value === 'Yes'
  }

  private static processAnswers(
    questionAnswers: FormSubmissionEntryData,
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
        const processedValue = this.processQuestionValue(
          question,
          value as string | number | null,
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

  private static processQuestionValue(
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
          return option.value
        })

        return {
          value: validOptions.join(' | '),
          questionKey: question.name,
          questionId: question.id,
          optionId: null,
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

  private static async processGeneralFields(
    row: FormSubmissionEntryData,
    dashboardId: string,
  ) {
    // Process Dealer
    const dealerData = {
      name: row[GeneralFieldsEnum.DEALER_NAME]?.toString() || '',
      nameOther: row[GeneralFieldsEnum.OTHER_DEALER_NAME]?.toString() || '',
      sellerName: row[GeneralFieldsEnum.SELLER_NAME]?.toString() || '',
      sellerMobile: row[GeneralFieldsEnum.MOBILE_SELLER]?.toString() || '',
      sellerEmail: row[GeneralFieldsEnum.EMAIL_SELLER]?.toString() || '',
      notes: row[GeneralFieldsEnum.NOTES_SELLER]?.toString() || '',
    }

    const representativeData = {
      id: row[GeneralFieldsEnum.REPRESENTATIVE]?.toString() || '',
      name: row[GeneralFieldsEnum.REPRESENTATIVE_NAME]?.toString() || '',
    }

    const locationData = {
      id: row[GeneralFieldsEnum.LOCATION]?.toString() || '',
      code: row[GeneralFieldsEnum.LOCATION]?.toString() || '',
      name: row[GeneralFieldsEnum.LOCATION_NAME]?.toString() || '',
      address: row[GeneralFieldsEnum.LOCATION_ADDRESS]?.toString() || '',
      postalCode: row[GeneralFieldsEnum.LOCATION_POSTAL_CODE]?.toString() || '',
      city: row[GeneralFieldsEnum.LOCATION_CITY]?.toString() || '',
      state: row[GeneralFieldsEnum.LOCATION_STATE]?.toString() || '',
      country: row[GeneralFieldsEnum.LOCATION_COUNTRY]?.toString() || '',
      latitude: parseFloat(
        row[GeneralFieldsEnum.LOCATION_LATITUDE]?.toString() || '0',
      ),
      longitude: parseFloat(
        row[GeneralFieldsEnum.LOCATION_LONGITUDE]?.toString() || '0',
      ),
    }

    const submittedAt = row[GeneralFieldsEnum.DATE]
      ? parseDate(row[GeneralFieldsEnum.DATE].toString())
      : new Date()

    const startDate = row[GeneralFieldsEnum.START_DATE]
      ? parseDate(row[GeneralFieldsEnum.START_DATE].toString())
      : new Date()
    const endDate = row[GeneralFieldsEnum.END_DATE]
      ? parseDate(row[GeneralFieldsEnum.END_DATE].toString())
      : new Date()

    // Procesar datos del FormSubmission
    const submissionData = {
      submittedAt,
      notes: row[GeneralFieldsEnum.NOTE]?.toString() ?? null,
      tags:
        row[GeneralFieldsEnum.TAGS]?.toString()?.split(',').filter(Boolean) ||
        [],
      email: row[GeneralFieldsEnum.EMAIL]?.toString() ?? null,
      phone: row[GeneralFieldsEnum.PHONE]?.toString() ?? null,
      mobilePhone: row[GeneralFieldsEnum.MOBILE]?.toString() ?? null,
      status: row[GeneralFieldsEnum.STATUS]?.toString() ?? null,
      registered:
        row[GeneralFieldsEnum.REGISTERED]?.toString()?.toLowerCase() === 'true',
      startDate,
      endDate,
      formLink: row[GeneralFieldsEnum.FORM_LINK]?.toString() ?? '',
      legalName: row[GeneralFieldsEnum.LEGAL_NAME]?.toString() ?? null,
      dashboardId,
    }

    // Filtrar los campos que son preguntas
    const questionAnswers = Object.fromEntries(
      Object.entries(row).filter(
        ([key]) =>
          !Object.values(GeneralFieldsEnum).includes(key as GeneralFieldsEnum),
      ),
    )

    return {
      dealerData,
      representativeData,
      locationData,
      submissionData,
      questionAnswers,
    }
  }
}
