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
  Presentation,
  Product,
  ProductSale,
  Question,
  QuestionAttachment,
  QuestionGroup,
  QuestionOption,
  QuestionTrigger,
  Representative,
  SubBrand,
  SubBrandTemplate,
  User,
} from '@prisma/client'

export interface CreateClientRequest {
  name: string
  slug: string
}

export interface CreateClientResponse {
  user: User
  client: Client
}

export interface QuestionOptionWithRelations extends QuestionOption {
  triggers: QuestionTrigger[]
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
  location: Location
  representative: Representative
  activatedBrands: ActivatedBrandWithRelations[]
  productSales: ProductSaleWithRelations[]
}

export interface ActivatedBrandWithRelations extends ActivatedBrand {
  brand: Brand
}

export interface ProductWithRelations extends Product {
  presentation: Presentation
  brand: Brand
  subBrand: SubBrand
  flavor: Flavor
}

export interface ProductSaleWithRelations extends ProductSale {
  product: ProductWithRelations
}

export interface DashboardWithRelations extends Dashboard {
  template: FormTemplateWithRelations
  submissions: SubmissionWithRelations[]
  activatedBrands: ActivatedBrandWithRelations[]
  productSales: ProductSaleWithRelations[]
}

export interface ClientWithRelations extends Client {
  user: Pick<User, 'name' | 'email'>
  dashboard: DashboardWithRelations | null
}

export interface GetClientBySlugWithDashboardResponse {
  client: ClientWithRelations
}
