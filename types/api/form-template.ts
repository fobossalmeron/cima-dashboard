import { ApiStatus } from '@/enums/api-status'
import {
  Dashboard,
  Client,
  QuestionGroup,
  SubBrandTemplate,
  QuestionOption,
  QuestionTrigger,
  Brand,
  SubBrand,
  Question,
  FormTemplate as FormTemplatePrisma,
} from '@prisma/client'
import { NextResponse } from 'next/server'
import { QuestionWithRelations } from './dashboard-sync'

export interface FormTemplateOption {
  Id: string
  Value: string
  SortOrder: number
}

export interface FormTemplateTrigger {
  GroupId: string
  QuestionValue: string
}

export interface FormTemplateAttachment {
  id: string
  url: string
  type: string
  name: string
}

export interface FormTemplateQuestion {
  Options: FormTemplateOption[] | null
  Triggers: FormTemplateTrigger[]
  Id: string
  SortOrder: number
  Type: string
  Name: string
  IsMandatory: boolean
  IsAutoFill: boolean
  Attachments: FormTemplateAttachment[]
  QuestionGroupId: string | null
  ForImageRecognition: boolean | null
  MatrixGroupId: string | null
}

export interface FormTemplateQuestionGroup {
  FreeFormItems: Record<string, unknown> | null
  Id: string
  Name: string
  Type: string
  TriggeredBy: {
    QuestionId: string
    QuestionValue: string
  }[]
}

export interface FormTemplate {
  Questions: FormTemplateQuestion[]
  Id: string
  Name: string
  Description: string
  Active: boolean
  SortOrder: number
  Version: number
  CreatedBy: string
  CreatedUtc: string
  LastUpdatedBy: string
  LastUpdatedUtc: string
  LastUpdatedLocal: string
  QuestionGroups: FormTemplateQuestionGroup[]
}

export interface FormTemplateRequest {
  clientName: string
  clientSlug: string
  templateId: string
  dashboardName?: string
}

export interface FormTemplateSuccessResponse {
  status: ApiStatus.SUCCESS
  data: FormTemplateBodyResponse
}

export interface FormTemplateErrorResponse {
  status: ApiStatus.ERROR
  error: string
}

export type FormTemplateResponse =
  | FormTemplateSuccessResponse
  | FormTemplateErrorResponse

export interface FormTemplateServiceParams {
  clientId: string
  template: FormTemplate
  dashboardName?: string
}

export interface FormTemplateUpdateParams {
  template: FormTemplate
}

export interface DashboardCreateParams {
  clientId: string
  name: string
  templateId: string
}

export interface FormTemplateCreateParams {
  id: string
  name: string
  description: string
  active: boolean
  sortOrder: number
  version: number
  createdBy: string
  updatedBy: string
}

export type FormTemplateUpdateQuestion = Question & {
  options: QuestionOptionWithRelations[]
  triggers: QuestionTrigger[]
}

export type FormTemplateWithQuestionsAndOptions = FormTemplatePrisma & {
  questions: FormTemplateUpdateQuestion[]
  questionGroups: QuestionGroup[]
}

export interface FormTemplateCreateResponse {
  dashboard: Dashboard
  template: FormTemplateWithQuestionsAndOptions
}

export interface FormTemplateUpdateQuestionsResponse {
  questions: FormTemplateUpdateQuestion[]
}

export interface FormTemplateBodyResponse extends FormTemplateCreateResponse {
  client: Client
}

export interface NextResponseFormTemplate extends Omit<NextResponse, 'body'> {
  body: FormTemplateBodyResponse
}

export interface QuestionOptionWithRelations extends QuestionOption {
  triggers: QuestionTrigger[]
}

export interface SubBrandTemplateWithRelations extends SubBrandTemplate {
  subBrand: SubBrand & {
    brand: Brand
  }
}

export interface FormTemplateWithRelations extends FormTemplate {
  questionGroups: QuestionGroup[]
  questions: QuestionWithRelations[]
  subBrandTemplates: SubBrandTemplateWithRelations[]
}
