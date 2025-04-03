import {
  ActivatedBrand,
  AgeRange,
  Answer,
  Brand,
  Client,
  ConsumptionMoment,
  Dashboard,
  Ethnicity,
  Flavor,
  FormSubmission,
  FormTemplate,
  Gender,
  GiveawayProduct,
  GiveawayProductType,
  Location,
  Photo,
  PhotoType,
  PointOfSale,
  Presentation,
  Product,
  ProductLocation,
  ProductLocationSubmission,
  ProductSale,
  PurchaseIntention,
  Question,
  QuestionAttachment,
  QuestionGroup,
  QuestionTrigger,
  Representative,
  Sampling,
  SamplingTraffic,
  SubBrand,
  SubBrandTemplate,
  SyncLog,
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

interface SamplingWithRelations extends Sampling {
  consumptionMoments: {
    consumptionMoment: ConsumptionMoment
  }[]
  purchaseIntentions: {
    purchaseIntention: PurchaseIntention
  }[]
  traffic: SamplingTraffic
  gender: Gender
  ageRange: AgeRange
  ethnicity: Ethnicity
}

export interface PhotoWithRelations extends Photo {
  type: PhotoType
}

export interface ProductLocationSubmissionWithRelations
  extends ProductLocationSubmission {
  productLocation: ProductLocation
}

export interface GiveawayProductWithRelations extends GiveawayProduct {
  giveawayProductType: GiveawayProductType
}

export interface SubmissionWithRelations extends FormSubmission {
  answers: Answer[]
  location: Location | null
  representative: Representative | null
  activatedBrands: ActivatedBrandWithRelations[]
  productSales: ProductSaleWithRelations[]
  productLocationSubmissions: ProductLocationSubmissionWithRelations[]
  pointOfSale: PointOfSale | null
  sampling: SamplingWithRelations | null
  photos: PhotoWithRelations[]
  giveawayProducts: GiveawayProductWithRelations[]
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
  syncLogs: SyncLog[]
}

export interface ClientWithRelations extends Client {
  dashboard: DashboardWithRelations | null
}

export interface GetClientBySlugWithDashboardResponse {
  client: ClientWithRelations
}
