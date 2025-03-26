import { PointOfSale, Prisma } from '@prisma/client'
import { PointOfSaleRepository } from '@/lib/repositories'
import { FormSubmissionEntryData } from '@/types/api'
import { DataFieldsEnum } from '@/enums/data-fields'

export class PointOfSaleService {
  static async processRow(
    row: FormSubmissionEntryData,
    tx?: Prisma.TransactionClient,
  ): Promise<PointOfSale | null> {
    const pointOfSale = row[DataFieldsEnum.POINT_OF_SALE]?.toString()

    if (!pointOfSale) return null

    return await PointOfSaleRepository.createOrUpdate(
      { name: pointOfSale, slug: pointOfSale.toLowerCase() },
      tx,
    )
  }
}
