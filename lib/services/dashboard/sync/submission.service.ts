import {
  BrandWithSubBrands,
  FormSubmissionEntryData,
  QuestionWithRelations,
  RowTransactionResult,
  RowTransactionSuccessResult,
} from '@/types/api'
import { Prisma } from '@prisma/client'
import { SyncStatus as SyncStatusEnum } from '@/enums/dashboard-sync'
import { withTransaction } from '@/prisma/prisma'
import { QuestionSyncService } from './question.service'
import { AnswerSyncService } from './answer.service'
import { GeneralFieldsService } from './general-fields.service'
import { BrandSyncService } from './brand.service'
import { ProductSyncService } from './product.service'
import { DealerService } from './dealer.service'
import { PointOfSaleService } from '../point-of-sale.service'
import { ProductLocationService } from '../product-location.service'
import { slugify } from '@/lib/utils'

export class SubmissionSyncService {
  static async processRow(
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
            pointOfSale: pointOfSaleOption,
            productInPromotion,
            riskZone,
            samplesDelivered,
          } = await GeneralFieldsService.processGeneralFields(row, dashboardId)

          const pointOfSale = await this.processPointOfSale(
            pointOfSaleOption,
            tx,
          )

          const productLocation = await this.processProductLocation(
            row,
            questions,
            tx,
          )

          const dealer = await DealerService.create(dealerData, tx)

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
              pointOfSaleId: pointOfSale?.id,
              productLocationId: productLocation?.id,
              productInPromotion,
              samplesDelivered,
              riskZone,
            },
          })

          // Obtener las preguntas activas basadas en las respuestas
          const activeQuestions = QuestionSyncService.getActiveQuestions(
            questionAnswers,
            questions,
          )

          // Procesar las respuestas y validar
          const { answers: validAnswers, errors } =
            AnswerSyncService.processAnswers(
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

          // Crear las respuestas
          const answers = await AnswerSyncService.createAnswers(
            tx,
            submission.id,
            validAnswers,
          )

          // Procesar marcas activadas
          const brandQuestion = questions.find((q) =>
            q.name.toUpperCase().includes('MARCA ACTIVADA'),
          )

          let brands: BrandWithSubBrands[] = []

          if (brandQuestion) {
            brands = await BrandSyncService.processActivatedBrands(
              tx,
              submission.id,
              questionAnswers[brandQuestion.name],
              brandQuestion,
            )
          }

          // Procesar ventas de productos
          const { productSales, totalQuantity, totalAmount } =
            await ProductSyncService.processProductSales(
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

      return result as RowTransactionSuccessResult
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

  private static async processPointOfSale(
    pointOfSale?: string,
    tx?: Prisma.TransactionClient,
  ) {
    if (!pointOfSale) return null
    return await PointOfSaleService.createOrUpdate(
      { name: pointOfSale, slug: pointOfSale.toLowerCase() },
      tx,
    )
  }

  private static async processProductLocation(
    row: FormSubmissionEntryData,
    questions: QuestionWithRelations[],
    tx?: Prisma.TransactionClient,
  ) {
    const productLocationQuestion = questions.find((q) =>
      q.name.toUpperCase().includes('UBICACIÓN DEL PRODUCTO'),
    )
    if (!productLocationQuestion) return null

    const productLocation = row[productLocationQuestion.name]
    if (!productLocation) return null

    const productLocationName = productLocation.toString()

    return await ProductLocationService.createOrUpdate(
      { name: productLocationName, slug: slugify(productLocationName) },
      tx,
    )
  }
}
