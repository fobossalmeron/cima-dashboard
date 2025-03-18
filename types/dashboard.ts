import { ApiStatus } from '@/enums/api-status'
import { FormTemplateSearchResponse } from './api/form-template-search-response'

export interface FormTemplate {
  id: string
  name: string
  description?: string
  lastUpdatedUtc: string
}

export enum SearchOperator {
  Is = 'Is',
  Contains = 'Contains',
}

export enum SearchType {
  IsActive = 'IsActive',
  Search = 'Search',
}

export interface SearchElement {
  Operator: SearchOperator
  Type: SearchType
  Value: boolean | string
}

export interface FormSearchRequest {
  Skip: number
  Limit: number
  Elements: SearchElement[]
  SortField: string
  SortDescending: boolean
}

export interface FormSearchData {
  items: FormTemplateSearchResponse[]
  total: number
}

export interface FormSearchSuccessResponse {
  status: ApiStatus.SUCCESS
  data: FormSearchData
}

export interface FormSearchErrorResponse {
  status: ApiStatus.ERROR
  error: string
}

export type FormSearchResponse =
  | FormSearchSuccessResponse
  | FormSearchErrorResponse

export interface NewDashboardForm {
  clientName: string
  clientSlug: string
  templateId: string
}
