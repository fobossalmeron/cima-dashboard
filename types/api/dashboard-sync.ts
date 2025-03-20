import {
  Answer,
  Brand,
  Dealer,
  FormSubmission,
  Location,
  Question,
  QuestionGroup,
  QuestionOption,
  Representative,
  SubBrand,
} from '@prisma/client'
import { FormSubmissionEntryData } from './products'
import { SyncStatus as SyncStatusEnum } from '@/enums/dashboard-sync'
import { NextResponse } from 'next/server'

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
  selectedOptionIds?: string[]
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
  status: SyncStatusEnum.SUCCESS
  dashboardId: string
  dealer: Dealer
  representative: Representative
  location: Location
  submission: FormSubmission
  answers: Answer[]
}

export interface RowTransactionErrorResult {
  status: SyncStatusEnum.ERROR
  rowIndex: number
  errors: ValidationError[]
}

export interface RowTransactionSkippedResult {
  status: SyncStatusEnum.SKIPPED
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

export interface SyncStatus {
  status: SyncStatusEnum.SUCCESS | SyncStatusEnum.ERROR | SyncStatusEnum.SKIPPED
  message: string
  data?: {
    submissionId: string
    totalQuantity: number
    totalAmount: number
  }
  error?: Error
}

export interface BrandWithSubBrands extends Brand {
  subBrands: SubBrand[]
}

export interface SubBrandWithBrand extends SubBrand {
  brand: Brand
}
