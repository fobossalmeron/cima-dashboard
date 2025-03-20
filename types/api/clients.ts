import {
  ActivatedBrand,
  Answer,
  Brand,
  Client,
  Dashboard,
  Flavor,
  FormSubmission,
  FormTemplate,
  Location,
  PointOfSale,
  Presentation,
  Product,
  ProductLocation,
  ProductSale,
  Question,
  QuestionAttachment,
  QuestionGroup,
  QuestionTrigger,
  Representative,
  SubBrand,
  SubBrandTemplate,
} from '@prisma/client'
import { QuestionOptionWithRelations } from './form-template'

export interface CreateClientRequest {
  name: string
  slug: string
}

export interface CreateClientResponse {
  client: Client
}

export interface QuestionWithRelations extends Question {
  options: QuestionOptionWithRelations[]
  attachments: QuestionAttachment[]
  triggers: QuestionTrigger[]
}

export interface SubBrandWithRelations extends SubBrand {
  brand: Brand
}

export interface SubBrandTemplateWithRelations extends SubBrandTemplate {
  subBrand: SubBrandWithRelations
}

export interface FormTemplateWithRelations extends FormTemplate {
  questionGroups: QuestionGroup[]
  questions: QuestionWithRelations[]
  subBrandTemplates: SubBrandTemplateWithRelations[]
}

export interface SubmissionWithRelations extends FormSubmission {
  answers: Answer[]
  location: Location | null
  representative: Representative | null
  activatedBrands: ActivatedBrandWithRelations[]
  productSales: ProductSaleWithRelations[]
  productLocation: ProductLocation | null
  pointOfSale: PointOfSale | null
}

export interface ProductWithRelations extends Product {
  presentation: Presentation | null
  brand: Brand
  subBrand: SubBrand | null
  flavor: Flavor | null
}

export interface ActivatedBrandWithRelations extends ActivatedBrand {
  brand: Brand
}

export interface ProductSaleWithRelations extends ProductSale {
  product: ProductWithRelations
}

export interface DashboardWithRelations extends Dashboard {
  template: FormTemplateWithRelations
  submissions: SubmissionWithRelations[]
}

export interface ClientWithRelations extends Client {
  dashboard: DashboardWithRelations | null
}

export interface GetClientBySlugWithDashboardResponse {
  client: ClientWithRelations
}
