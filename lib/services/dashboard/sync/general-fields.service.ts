/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormSubmissionEntryData, QuestionWithRelations } from '@/types/api'
import { GeneralFieldsEnum } from '@/enums/general-fields'
import { DataFieldSearchType, DataFieldsEnum } from '@/enums/data-fields'
import { parseDate } from '@/lib/utils/date'
import {
  DataFieldsTagsValues,
  ProcessGeneralFieldsResult,
} from '@/types/services'
import {
  DealerRepository,
  LocationRepository,
  RepresentativeRepository,
  SubmissionRepository,
} from '@/lib/repositories'
import {
  Location,
  PointOfSale,
  Prisma,
  ProductLocation,
  Representative,
} from '@prisma/client'
import { PointOfSaleService } from '../point-of-sale.service'
import { ProductLocationService } from './product-location.service'
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
    console.log('Location created')
    // Process Point of Sale
    const pointOfSale = await PointOfSaleService.processRow(row, tx)
    console.log('Point of Sale created')
    // Process product location
    const productLocation = await ProductLocationService.processRow(
      row,
      questions,
      tx,
    )
    console.log('Product Location created')

    return {
      dealer,
      representative,
      location,
      pointOfSale,
      productLocation,
    }
  }
}
