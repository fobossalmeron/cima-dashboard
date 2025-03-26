import { GeneralFieldsEnum } from '@/enums/general-fields'
import { DealerRepository } from '@/lib/repositories'
import { FormSubmissionEntryData } from '@/types/api'
import { Dealer, Prisma } from '@prisma/client'

export class DealerService {
  /**
   * Process Dealer from row submission
   * @param {FormSubmissionEntryData} row - Row submission
   * @param {Prisma.TransactionClient} tx - Transaction client
   * @returns {Promise<Dealer>} Dealer
   */
  static async processDealer(
    row: FormSubmissionEntryData,
    tx?: Prisma.TransactionClient,
  ): Promise<Dealer> {
    const dealerData = {
      name: row[GeneralFieldsEnum.DEALER_NAME]?.toString() || '',
      nameOther: row[GeneralFieldsEnum.OTHER_DEALER_NAME]?.toString() || '',
      sellerName: row[GeneralFieldsEnum.SELLER_NAME]?.toString() || '',
      sellerMobile: row[GeneralFieldsEnum.MOBILE_SELLER]?.toString() || '',
      sellerEmail: row[GeneralFieldsEnum.EMAIL_SELLER]?.toString() || '',
      notes: row[GeneralFieldsEnum.NOTES_SELLER]?.toString() || '',
    }

    return await DealerRepository.create(dealerData, tx)
  }
}
