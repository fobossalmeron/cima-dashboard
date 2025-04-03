import { FormSubmissionEntryData, QuestionWithRelations } from '@/types/api'
import { ProcessGeneralFieldsResult } from '@/types/services'
import { Prisma } from '@prisma/client'
import { PointOfSaleService } from '../point-of-sale.service'
import { LocationService } from './location.service'
import { RepresentativeService } from './representative.service'
import { DealerService } from './dealer.service'

export class GeneralFieldsService {
  /**
   * Process General Fields from row submission
   * @param {FormSubmissionEntryData} row - Row submission
   * @param {string} dashboardId - Dashboard ID
   * @param {Prisma.TransactionClient} tx - Transaction client
   * @returns {Promise<ProcessGeneralFieldsResult>} General Fields saved in database and info for submission
   */
  static async processGeneralFields(
    row: FormSubmissionEntryData,
    questions: QuestionWithRelations[],
    tx?: Prisma.TransactionClient,
  ): Promise<ProcessGeneralFieldsResult> {
    // Process Dealer
    const dealer = await DealerService.processDealer(row, tx)
    // Process Representative
    const representative = await RepresentativeService.processRepresentative(
      row,
      tx,
    )
    // Process Location
    const location = await LocationService.processLocation(row, tx)
    // Process Point of Sale
    const pointOfSale = await PointOfSaleService.processRow(row, tx)

    return {
      dealer,
      representative,
      location,
      pointOfSale,
    }
  }
}
