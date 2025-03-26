import { GeneralFieldsEnum } from '@/enums/general-fields'
import { RepresentativeRepository } from '@/lib/repositories'
import { FormSubmissionEntryData } from '@/types/api'
import { Prisma, Representative } from '@prisma/client'

export class RepresentativeService {
  /**
   * Process Representative from row submission
   * @param {FormSubmissionEntryData} row - Row submission
   * @param {Prisma.TransactionClient} tx - Transaction client
   * @returns {Promise<Representative>} Representative
   */
  static async processRepresentative(
    row: FormSubmissionEntryData,
    tx?: Prisma.TransactionClient,
  ): Promise<Representative> {
    const representativeData = {
      id: row[GeneralFieldsEnum.REPRESENTATIVE]?.toString() || '',
      name: row[GeneralFieldsEnum.REPRESENTATIVE_NAME]?.toString() || '',
    }

    return await RepresentativeRepository.createOrUpdate(representativeData, tx)
  }
}
