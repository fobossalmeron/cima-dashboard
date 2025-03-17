import {
  Answer,
  Dealer,
  FormSubmission,
  Location,
  Question,
  QuestionGroup,
  QuestionOption,
  Representative,
} from '@prisma/client'
import { FormSubmissionEntryData } from './products'
import { NextResponse } from 'next/server'
import { SyncStatus } from '@/enums/dashboard-sync'

export interface QuestionWithRelations extends Question {
  options: QuestionOption[]
  questionGroup: QuestionGroup | null
  triggers: Array<{
    option: QuestionOption | null
    group: QuestionGroup | null
  }>
}

export interface ProcessGeneralFieldsResponse {
  dealer: Dealer
  representative: Representative
  location: Location
  submission: FormSubmission
  questionAnswers: FormSubmissionEntryData
}

export interface AnswerValue {
  questionKey: string
  value: string | number | null
  questionId: string
  optionId: string | null
}

export interface ProcessAnswersResponse {
  answers: AnswerValue[]
  errors: ValidationError[]
}

export interface ValidationError {
  row: number
  column: string
  error: string
}

export interface SyncRequest {
  formData: FormSubmissionEntryData[]
}

export interface RowTransactionSuccessResult {
  status: SyncStatus.SUCCESS
  dashboardId: string
  dealer: Dealer
  representative: Representative
  location: Location
  submission: FormSubmission
  answers: Answer[]
}

export interface RowTransactionErrorResult {
  status: SyncStatus.ERROR
  rowIndex: number
  errors: ValidationError[]
}

export interface RowTransactionSkippedResult {
  status: SyncStatus.SKIPPED
  rowIndex: number
  submission: FormSubmission
}

export type RowTransactionResult =
  | RowTransactionSuccessResult
  | RowTransactionErrorResult
  | RowTransactionSkippedResult

export interface ValidationResult {
  validSubmissions: RowTransactionSuccessResult[]
  invalidSubmissions: RowTransactionErrorResult[]
  skippedSubmissions: RowTransactionSkippedResult[]
}

export interface SyncResponseBodySuccess {
  data: ValidationResult
  error: null
}

export interface SyncResponseBodyError {
  data: null
  error: string
}

export type SyncResponseBody = SyncResponseBodySuccess | SyncResponseBodyError

export type SyncResponse = NextResponse<SyncResponseBody>
