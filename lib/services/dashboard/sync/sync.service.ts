import {
  FormSubmissionEntryData,
  QuestionWithRelations,
  RowTransactionErrorResult,
  RowTransactionResult,
  RowTransactionSkippedResult,
  RowTransactionSuccessResult,
  ValidationResult,
} from '@/types/api'
import { SyncStatus as SyncStatusEnum } from '@/enums/dashboard-sync'
import { DashboardService } from '@/lib/services'
import { SubmissionSyncService } from './submission.service'
import { QuestionSyncService } from './question.service'

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
    const questions = await QuestionSyncService.getTemplateQuestions(
      dashboard.templateId,
    )

    // Crear un mapa de nombre de pregunta a pregunta para búsqueda rápida
    const questionMap = new Map<string, QuestionWithRelations>(
      questions.map((q: QuestionWithRelations) => [q.name.trim(), q]),
    )

    const validSubmissions: RowTransactionSuccessResult[] = []
    const invalidSubmissions: RowTransactionErrorResult[] = []
    const skippedSubmissions: RowTransactionSkippedResult[] = []

    // Procesar cada fila del CSV
    const rowsPromises = formData.map((row, rowIndex) =>
      SubmissionSyncService.processRow(
        id,
        row,
        rowIndex,
        questions,
        questionMap,
      ),
    )

    await Promise.all(rowsPromises)
      .then((results) => {
        results.forEach((result: RowTransactionResult) => {
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
}
