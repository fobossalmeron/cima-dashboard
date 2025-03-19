import { ApiStatus } from '@/enums/api-status'
import { SyncStatus } from '@/enums/dashboard-sync'
import {
  Answer,
  Brand,
  Flavor,
  Presentation,
  Product,
  Question,
  QuestionOption,
  QuestionTrigger,
  SubBrand,
} from '@prisma/client'

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

export interface SubBrandStructure {
  name: string
  info: SubBrand | null
  presentation: Presentation
  products: Product[]
}

export type SubBrandsStructure = Record<string, SubBrandStructure>

export interface BrandStructure {
  info: Brand
  subBrands: SubBrandsStructure
}

export type ProductsStructure = Record<string, BrandStructure>

export interface LoadProductsFromTemplateSuccessResponse {
  data: ProductsStructure
  error: null
}

export interface LoadProductsFromTemplateErrorResponse {
  error: string
  data: null
}

export type LoadProductsFromTemplateResponse =
  | LoadProductsFromTemplateSuccessResponse
  | LoadProductsFromTemplateErrorResponse

export interface SubBrandAndPresentation {
  subBrand: SubBrand | null
  presentation: Presentation
}

export interface ProductNameInfo {
  brand: string
  subBrand: string
  presentation: string
}

export interface ProductInfo {
  brand: Brand
  subBrand: SubBrand | null
  presentation: Presentation
  flavor?: string
  questionGroupId?: string
}

export interface QuestionWithOptions extends Question {
  options: QuestionOption[]
  triggers: QuestionTrigger[]
}

export interface QuestionGroup {
  key: string
  items: QuestionWithOptions[]
  parentTrigger?: QuestionTrigger
}

export interface ProductWithFlavorAndPresentation extends Product {
  flavor: Flavor | null
  presentation: Presentation | null
}

export interface SubBrandWithProducts extends SubBrand {
  products: ProductWithFlavorAndPresentation[]
}

export interface BrandWithSubBrandsAndProducts extends Brand {
  subBrands: SubBrandWithProducts[]
}

export interface BrandWithOnlySubBrands extends Brand {
  subBrands: SubBrand[]
}

export interface AnswerWithQuestion extends Answer {
  question: Question
}

export interface GetAllBrandsWithSubBrandsSuccessResponse {
  data: BrandWithOnlySubBrands[]
  error: null
}

export interface GetAllBrandsWithSubBrandsErrorResponse {
  error: string
  data: null
}

export type GetAllBrandsWithSubBrandsResponse =
  | GetAllBrandsWithSubBrandsSuccessResponse
  | GetAllBrandsWithSubBrandsErrorResponse

export interface FormSubmissionEntryData {
  [key: string]: string | number | null
}

export interface SyncDashboardSuccessResponse {
  status: ApiStatus.SUCCESS
  data: FormSubmissionEntryData[]
  error?: null
}

export interface SyncDashboardErrorResponse {
  status: ApiStatus.ERROR
  error: string
  data?: null
}

export type SyncDashboardResponse =
  | SyncDashboardSuccessResponse
  | SyncDashboardErrorResponse

export interface SyncResult {
  status: SyncStatus
  message: string
  data?: {
    submissionId: string
    totalQuantity: number
    totalAmount: number
  }
  error?: Error
}
