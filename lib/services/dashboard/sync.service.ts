import { prisma } from '@/lib/prisma'
import {
  AnswerValue,
  BrandWithSubBrands,
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
import {
  DashboardService,
  ProductTemplateProcessorService,
  SubBrandsService,
} from '@/lib/services'
import { ValidationError, ValidationResult } from '@/types/api'
import { parseDate } from '@/lib/utils/date'
import { SyncStatus as SyncStatusEnum } from '@/enums/dashboard-sync'
import { slugify } from '@/lib/utils'
import { withTransaction } from '@/prisma/prisma'

export class DashboardSyncService {
  static async sync(
    id: string,
    formData: FormSubmissionEntryData[],
  ): Promise<ValidationResult> {
    const dashboard = await DashboardService.getById(id)
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
          if (result.status === SyncStatusEnum.SUCCESS) {
            validSubmissions.push(result)
          } else if (result.status === SyncStatusEnum.SKIPPED) {
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
      const result = await withTransaction(
        async (tx: Prisma.TransactionClient) => {
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
              status: SyncStatusEnum.SKIPPED,
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

          // Procesar marcas activadas
          const brandQuestion = questions.find((q) =>
            q.name.toUpperCase().includes('MARCA ACTIVADA'),
          )

          let brands: BrandWithSubBrands[] = []

          if (brandQuestion) {
            brands = await this.processActivatedBrands(
              tx,
              submission.id,
              questionAnswers[brandQuestion.name],
              brandQuestion,
            )
          }

          // Procesar ventas de productos
          const { productSales, totalQuantity, totalAmount } =
            await this.processProductSales(
              tx,
              submission.id,
              questionAnswers,
              questions,
              activeQuestions,
              brands,
            )

          // Actualizar totales en el submission
          await tx.formSubmission.update({
            where: { id: submission.id },
            data: {
              totalQuantity,
              totalAmount,
            },
          })

          return {
            status: SyncStatusEnum.SUCCESS,
            dashboardId,
            dealer,
            representative,
            location,
            submission,
            answers,
            productSales,
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
              status: SyncStatusEnum.ERROR,
              rowIndex: rowIndex + 1,
              errors: parsedError.errors,
            }
          } else {
            return {
              status: SyncStatusEnum.ERROR,
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
            status: SyncStatusEnum.ERROR,
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
          status: SyncStatusEnum.ERROR,
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

  /**
   * Obtiene el conjunto de IDs de preguntas que deben estar activas basado en las respuestas
   * y sus triggers recursivamente.
   */
  private static getActiveQuestions(
    answers: Record<string, string | number | null>,
    questions: QuestionWithRelations[],
  ): Set<string> {
    const activeQuestions = new Set<string>()
    const activeGroups = new Set<string>()
    const processedQuestions = new Set<string>()

    // Procesar todas las respuestas iniciales
    Object.entries(answers).forEach(([questionName, answer]) => {
      this.activateQuestionsRecursively({
        questionName,
        answer,
        questions,
        answers,
        activeQuestions,
        activeGroups,
        processedQuestions,
      })
    })

    return activeQuestions
  }

  /**
   * Procesa recursivamente una pregunta y sus triggers, activando las preguntas
   * y grupos correspondientes basados en las respuestas.
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

    const question = questions.find((q) => q.name === questionName)
    if (!question) return

    // Activar la pregunta actual solo si tiene una respuesta válida
    if (answer !== null && answer !== undefined) {
      activeQuestions.add(question.id)
    }

    // Si no hay respuesta o no hay triggers, no hay más que procesar
    if (!answer || !question.triggers.length) return

    // Procesar los triggers de la pregunta
    question.triggers.forEach((trigger) => {
      if (!trigger.group || !trigger.option) return

      const isTriggered =
        answer.toString().toLowerCase() === trigger.option.value.toLowerCase()

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
        row[GeneralFieldsEnum.LOCATION_LATITUDE]
          ?.toString()
          .replace(',', '.') || '0',
      ),
      longitude: parseFloat(
        row[GeneralFieldsEnum.LOCATION_LONGITUDE]
          ?.toString()
          .replace(',', '.') || '0',
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

  public static getSelectedBrands(
    brandValue: string | number | null,
    brandQuestion: QuestionWithRelations,
  ) {
    if (!brandValue || !brandQuestion.options) return []

    return brandQuestion.type === QuestionType.MULTISELECT
      ? brandValue.toString().split(' | ')
      : [brandValue.toString()]
  }

  private static async processActivatedBrands(
    tx: Prisma.TransactionClient,
    submissionId: string,
    brandValue: string | number | null,
    brandQuestion: QuestionWithRelations,
  ): Promise<BrandWithSubBrands[]> {
    const selectedBrands = DashboardSyncService.getSelectedBrands(
      brandValue,
      brandQuestion,
    )

    const brands: BrandWithSubBrands[] = []

    for (const brandName of selectedBrands) {
      const subBrand = await SubBrandsService.getBySlug(slugify(brandName))

      if (!subBrand) {
        throw new Error(`Marca no encontrada: ${slugify(brandName)}`)
      }

      const brandFound = brands.find((b) => b.id === subBrand.brandId)

      if (brandFound) {
        brandFound.subBrands.push(subBrand)
      } else {
        brands.push({
          ...subBrand.brand,
          subBrands: [subBrand],
        })
      }

      await tx.activatedBrand.upsert({
        where: {
          submissionId_brandId: {
            submissionId,
            brandId: subBrand.brandId,
          },
        },
        update: {},
        create: {
          submissionId,
          brandId: subBrand.brandId,
        },
      })
    }

    return brands
  }

  private static async processProductSales(
    tx: Prisma.TransactionClient,
    submissionId: string,
    questionAnswers: Record<string, string | number | null>,
    questions: QuestionWithRelations[],
    activeQuestions: Set<string>,
    brands: BrandWithSubBrands[],
  ) {
    let totalQuantity = 0
    let totalAmount = 0
    const productSales = []

    // Encontrar todas las preguntas de precio activas
    const priceQuestions = questions.filter(
      (q) =>
        activeQuestions.has(q.id) &&
        q.type === QuestionType.NUMERIC &&
        q.name.toUpperCase().includes('PRECIO'),
    )

    for (const priceQuestion of priceQuestions) {
      const price = Number(questionAnswers[priceQuestion.name] || 0)
      if (price <= 0) continue

      // Para cada pregunta de precio, buscar en todas las marcas activas
      for (const brand of brands) {
        for (const subBrand of brand.subBrands) {
          // Extraer información del producto de la pregunta
          const presentationName =
            ProductTemplateProcessorService.getPresentationName(
              priceQuestion.name,
              brand.name,
            )

          if (!presentationName) continue

          // Buscar la pregunta MULTISELECT de unidades vendidas para esta presentación
          const salesMultiselectQuestion = questions.find(
            (q) =>
              activeQuestions.has(q.id) &&
              q.type === QuestionType.MULTISELECT &&
              q.name.toUpperCase().includes('UNIDADES VENDIDAS') &&
              q.name.toUpperCase().includes(presentationName.toUpperCase()),
          )

          if (!salesMultiselectQuestion) continue

          // Obtener los sabores seleccionados
          const selectedFlavors =
            (questionAnswers[salesMultiselectQuestion.name] as string)?.split(
              ' | ',
            ) || []

          for (const flavor of selectedFlavors) {
            // Encontrar el trigger que corresponde a este sabor
            const trigger = salesMultiselectQuestion.triggers.find(
              (t) => t.option?.value.toLowerCase() === flavor.toLowerCase(),
            )

            if (!trigger?.group) continue

            // Encontrar la pregunta de cantidad específica para este sabor en el grupo activado
            const flavorQuantityQuestion = questions.find(
              (q) =>
                activeQuestions.has(q.id) &&
                q.questionGroupId === trigger.group?.id &&
                q.name.toLowerCase().includes(flavor.toLowerCase()),
            )

            if (!flavorQuantityQuestion) continue

            const quantity = Number(
              questionAnswers[flavorQuantityQuestion.name] || 0,
            )
            if (quantity <= 0) continue

            const whereParams = {
              presentation: {
                slug: slugify(presentationName.toLowerCase()),
              },
              brand: {
                slug: brand.slug,
              },
              subBrand: {
                slug: subBrand.slug,
              },
              flavor: {
                slug: slugify(flavor.toLowerCase()),
              },
            }

            // Buscar el producto específico con este sabor
            const product = await tx.product.findFirst({
              where: whereParams,
            })

            if (!product) continue

            const total = price * quantity
            totalQuantity += quantity
            totalAmount += total

            const productSale = await tx.productSale.create({
              data: {
                submissionId,
                productId: product.id,
                quantity,
                price,
                total,
              },
            })

            productSales.push(productSale)
          }
        }
      }
    }

    return { productSales, totalQuantity, totalAmount }
  }

  private static async getProducts(
    tx: Prisma.TransactionClient,
    questionName: string,
    brandName: string,
    subBrandName: string,
  ) {
    const presentationName =
      ProductTemplateProcessorService.getPresentationName(
        questionName,
        brandName,
      )

    if (presentationName) {
      return await tx.product.findMany({
        where: {
          presentation: {
            slug: slugify(presentationName.toLowerCase()),
          },
          brand: {
            slug: slugify(brandName.toLowerCase()),
          },
          subBrand: {
            slug: slugify(subBrandName.toLowerCase()),
          },
        },
      })
    }

    return []
  }
}
