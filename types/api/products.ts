import { FormTemplate } from '@prisma/client'

export interface RepslyProduct {
  id: string
  name: string
  brand: string
  subBrand?: string
  presentation?: string
  flavor?: string
}

export interface RepslyProductsResponse {
  products: RepslyProduct[]
  total: number
  page: number
  pageSize: number
}

export interface ImportProductsResponse {
  imported: number
  skipped: number
  errors: string[]
}

export interface LoadProductsFromTemplateSuccessResponse {
  data: FormTemplate
  error: null
}

export interface LoadProductsFromTemplateErrorResponse {
  error: string
  data: null
}

export type LoadProductsFromTemplateResponse =
  | LoadProductsFromTemplateSuccessResponse
  | LoadProductsFromTemplateErrorResponse
