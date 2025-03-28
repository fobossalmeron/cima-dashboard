import {
  FormSubmissionEntryData,
  QuestionWithRelations,
  RowTransactionResult,
  RowTransactionSuccessResult,
} from '@/types/api'
import { Prisma } from '@prisma/client'
import { SyncStatus as SyncStatusEnum } from '@/enums/dashboard-sync'
import { withTransaction } from '@/prisma/prisma'
import { AnswerSyncService } from './answer.service'
import { GeneralFieldsService } from './general-fields.service'
import { BrandSyncService } from './brand.service'
import { ProductSyncService } from './product.service'
import { SamplingService } from './sampling.service'
import { PhotosService } from './photos.service'
import { DatesFieldsEnum, GeneralFieldsEnum } from '@/enums/general-fields'
import { parseDate } from '@/lib/utils/date'
import { SubmissionRepository } from '@/lib/repositories'
import {
  DataFieldsTagsValues,
  ProcessSubmissionParams,
  ProcessSubmissionResult,
} from '@/types/services'
import { DataFieldSearchType, DataFieldsEnum } from '@/enums/data-fields'
import { Log } from '@/lib/utils/log'

export class SubmissionSyncService {
  private static async processSubmission(
    params: ProcessSubmissionParams,
  ): Promise<ProcessSubmissionResult> {
    const { row, data, tx } = params

    const submittedAt = row[DatesFieldsEnum.ACTIVATION_DATE]
      ? parseDate(row[DatesFieldsEnum.ACTIVATION_DATE].toString())
      : new Date()

    const startDate = row[GeneralFieldsEnum.START_DATE]
      ? parseDate(row[GeneralFieldsEnum.START_DATE].toString())
      : new Date()

    const endDate = row[GeneralFieldsEnum.END_DATE]
      ? parseDate(row[GeneralFieldsEnum.END_DATE].toString())
      : new Date()

    const samplesDelivered = row[DataFieldsEnum.SAMPLES_DELIVERED]?.toString()
      ? Number(row[DataFieldsEnum.SAMPLES_DELIVERED]?.toString())
      : 0

    const productInPromotion =
      row[DataFieldsEnum.PRODUCT_IN_PROMOTION]?.toString()?.toLowerCase() ===
      'Yes'

    const riskZone =
      row[DataFieldsEnum.RISK_ZONE]?.toString()?.toLowerCase() === 'Yes'

    const firstActivation =
      Object.entries(row).find(([key]) => {
        const { tags, searchType } =
          DataFieldsTagsValues[DataFieldsEnum.FIRST_ACTIVATION]
        switch (searchType) {
          case DataFieldSearchType.OR:
            return tags.some((tag) => key.includes(tag))
          case DataFieldSearchType.AND:
            return tags.every((tag) => key.includes(tag))
        }
      })?.[1] === 'Yes'

    const submissionData = {
      ...data,
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
      productInPromotion,
      samplesDelivered,
      riskZone,
      firstActivation,
    }

    const { dashboardId, locationId, representativeId } = data

    const submissionExists = await SubmissionRepository.findUnique(
      {
        dashboardId,
        locationId,
        representativeId,
        startDate,
        endDate,
      },
      tx,
    )

    if (submissionExists) {
      return {
        submission: submissionExists,
        submissionStatus: SyncStatusEnum.UPDATED,
      }
    }

    const submission = await SubmissionRepository.create(submissionData, tx)

    return {
      submission,
      submissionStatus: SyncStatusEnum.SUCCESS,
    }
  }

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
          // Extract general fields from row
          const {
            dealer,
            representative,
            location,
            pointOfSale,
            productLocation,
          } = await GeneralFieldsService.processGeneralFields(
            row,
            questions,
            tx,
          )

          const { submission, submissionStatus } = await this.processSubmission(
            {
              row,
              data: {
                dashboardId,
                locationId: location.id,
                representativeId: representative.id,
                pointOfSaleId: pointOfSale?.id ?? null,
                productLocationId: productLocation?.id ?? null,
              },
              tx,
            },
          )
          // Create or update sampling
          await SamplingService.createOrUpdate(row, submission.id, tx)
          // Create or update photos
          await PhotosService.createOrUpdate(row, submission.id, tx)

          // Process answers and validate
          const {
            answers: validAnswers,
            errors,
            questionAnswers,
            activeQuestions,
          } = AnswerSyncService.processAnswers(
            row,
            questions,
            questionMap,
            rowIndex,
          )

          // If there are errors, throw an exception to make a rollback
          if (errors.length > 0) {
            throw new Error(
              JSON.stringify({
                type: 'ValidationErrors',
                errors,
              }),
            )
          }

          // Create answers
          const answers = await AnswerSyncService.createAnswers(
            submission.id,
            validAnswers,
            tx,
          )

          // Process activated brands
          const brands = await BrandSyncService.processActivatedBrands(
            tx,
            submission.id,
            questions,
            questionAnswers,
          )

          // Process product sales
          const { productSales, totalQuantity, totalAmount } =
            await ProductSyncService.processProductSales(
              tx,
              submission.id,
              questionAnswers,
              questions,
              activeQuestions,
              brands,
            )

          // Update totals in the submission
          await tx.formSubmission.update({
            where: { id: submission.id },
            data: {
              totalQuantity,
              totalAmount,
            },
          })

          return {
            status: submissionStatus,
            rowIndex: rowIndex + 1,
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
        Log.error('Error', { error })
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
}
