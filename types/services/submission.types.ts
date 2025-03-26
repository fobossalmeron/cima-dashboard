import { FormSubmission, Prisma } from '@prisma/client'
import { FormSubmissionEntryData } from '../api'
import { SyncStatus } from '@/enums/dashboard-sync'

export interface ProcessSubmissionParams {
  row: FormSubmissionEntryData
  data: {
    dashboardId: string
    locationId: string
    representativeId: string
    pointOfSaleId: string | null
    productLocationId: string | null
  }
  tx?: Prisma.TransactionClient
}

export interface ProcessSubmissionResult {
  submission: FormSubmission
  submissionStatus: SyncStatus
}
