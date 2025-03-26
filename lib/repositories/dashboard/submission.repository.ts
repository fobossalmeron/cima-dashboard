import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export interface FindUniqueParams {
  dashboardId: string
  locationId: string
  representativeId: string
  submittedAt: Date
}

export interface FindUniqueByDatesParams {
  dashboardId: string
  locationId: string
  representativeId: string
  startDate: Date
  endDate: Date
}

interface CreateSubmissionParams {
  dashboardId: string
  locationId: string
  representativeId: string
  pointOfSaleId: string | null
  productLocationId: string | null
  submittedAt: Date
  notes: string | null
  tags: string[]
  email: string | null
  phone: string | null
  mobilePhone: string | null
  status: string | null
  registered: boolean
  startDate: Date
  endDate: Date
  formLink: string
  legalName: string | null
  productInPromotion: boolean
  samplesDelivered: number
  riskZone: boolean
  firstActivation: boolean
}

export class SubmissionRepository {
  static async findUnique(
    params: FindUniqueByDatesParams,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? prisma
    const { dashboardId, locationId, representativeId, startDate, endDate } =
      params
    return await client.formSubmission.findFirst({
      where: {
        dashboardId: dashboardId,
        locationId: locationId,
        representativeId: representativeId,
        startDate: startDate,
        endDate: endDate,
      },
    })
  }

  static async create(
    data: CreateSubmissionParams,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? prisma
    return await client.formSubmission.create({
      data,
    })
  }
}
