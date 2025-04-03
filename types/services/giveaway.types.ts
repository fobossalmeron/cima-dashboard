import { GiveawayProduct, Prisma } from '@prisma/client'
import { FormSubmissionEntryData, QuestionWithRelations } from '../api'

export interface CreateGiveawayData {
  giveawayProductTypeId: string
  submissionId: string
  quantity: number
}

export interface CreateGiveawayParams {
  data: CreateGiveawayData
  tx?: Prisma.TransactionClient
}

export interface ProcessGiveawayRowParams {
  submissionId: string
  row: FormSubmissionEntryData
  questionsMap: Map<string, QuestionWithRelations>
  questions: QuestionWithRelations[]
}

export interface ProcessGiveaway {
  submissionId: string
  value: string
  quantity: number
}

export interface ProcessGiveawayRowResponse {
  giveawayProducts: GiveawayProduct[]
}
