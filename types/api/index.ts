import { ApiStatus } from '@/enums/api-status'

export * from './auth'
export * from './client-data'
export * from './clustering'
export * from './dashboard'
export * from './dashboard-sync'
export * from './form-template'
export * from './form-template-search-response'
export * from './products'
export * from './giveaways'

export interface ApiResponse<T = unknown> {
  status: ApiStatus
  data?: T
  error?: string
}

export interface Form {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  stock: number
  createdAt: string
  updatedAt: string
}

export interface Submission {
  id: string
  submittedAt: string
  data: Record<string, unknown>
}

export interface FormSearchResponse extends ApiResponse {
  data?: {
    forms: Form[]
  }
}

export interface ProductResponse extends ApiResponse {
  data?: {
    products: Product[]
  }
}
