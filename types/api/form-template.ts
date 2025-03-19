import { ApiStatus } from '@/enums/api-status'
import { FormTemplateWithQuestionsAndOptions } from '@/lib/services'
import { Dashboard, Client, User } from '@prisma/client'
import { NextResponse } from 'next/server'

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

export interface FormTemplateCreateResponse {
  dashboard: Dashboard
  template: FormTemplateWithQuestionsAndOptions
}

export interface FormTemplateBodyResponse extends FormTemplateCreateResponse {
  client: Client
  user: User
}

export interface NextResponseFormTemplate extends Omit<NextResponse, 'body'> {
  body: FormTemplateBodyResponse
}
