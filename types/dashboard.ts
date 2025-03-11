import { FormTemplateResponse } from './api/form-template-search-response'

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

export interface FormSearchResponse {
  error?: string
  data?: {
    items: FormTemplateResponse[]
    total: number
  }
}

export interface NewDashboardForm {
  clientId: string
  formId: string
  name: string
}
