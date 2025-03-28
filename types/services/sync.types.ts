import { SyncJobStatus } from '@prisma/client'
import {
  FormSubmissionEntryData,
  RowTransactionErrorResult,
  RowTransactionPendingResult,
  RowTransactionSkippedResult,
  RowTransactionSuccessResult,
  RowTransactionUpdatedResult,
} from '../api'

export interface StartSyncSuccessResponse {
  batchId: string
  totalJobs: number
}

export interface StartSyncErrorResponse {
  error: string
}

export type StartSyncResponse =
  | StartSyncSuccessResponse
  | StartSyncErrorResponse

export interface SyncJob {
  id: string
  dashboardId: string
  status: SyncJobStatus
  totalRows: number
  processedRows: number
  validSubmissions: number
  invalidSubmissions: number
  skippedSubmissions: number
  updatedSubmissions: number
  error?: string
  createdAt: Date
  updatedAt: Date
  data: FormSubmissionEntryData[]
}

export interface SyncJobProgress {
  jobId: string
  dashboardId: string
  status: SyncJob['status']
  retryCount: number
  error?: string
  data?: unknown
}

export interface QStashMessage {
  jobId: string
  dashboardId: string
  data: unknown
}

export interface JobResult {
  retryCount: number
  status: SyncJobStatus
  error?: string
  data?: unknown
}

export interface SyncJobResult extends JobResult {
  status: SyncJobStatus
  retryCount: number
  error?: string
  data?: unknown
}

export interface PusherBatchProgress {
  batchId: string
  dashboardId: string
  totalJobs: number
  completedJobs: number
  failedJobs: number
  processingJobs: number
  pendingJobs: number
}

export interface BatchProgress extends PusherBatchProgress {
  validSubmissions: RowTransactionSuccessResult[]
  invalidSubmissions: RowTransactionErrorResult[]
  skippedSubmissions: RowTransactionSkippedResult[]
  updatedSubmissions: RowTransactionUpdatedResult[]
  pendingSubmissions: RowTransactionPendingResult[]
}
