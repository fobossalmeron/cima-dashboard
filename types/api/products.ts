import {
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
  flavor: Flavor
  presentation: Presentation
}

export interface SubBrandWithProducts extends SubBrand {
  products: ProductWithFlavorAndPresentation[]
}

export interface BrandWithSubBrands extends Brand {
  subBrands: SubBrandWithProducts[]
}

export interface GetAllBrandsWithSubBrandsSuccessResponse {
  data: BrandWithSubBrands[]
  error: null
}

export interface GetAllBrandsWithSubBrandsErrorResponse {
  error: string
  data: null
}

export type GetAllBrandsWithSubBrandsResponse =
  | GetAllBrandsWithSubBrandsSuccessResponse
  | GetAllBrandsWithSubBrandsErrorResponse
