import { RepresentativesFieldsEnum } from '@/enums/general-fields'
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
    if (!row[RepresentativesFieldsEnum.REPRESENTATIVE_OPTION]) {
      throw new Error('Representative name is required')
    }
    const representativeData = {
      name: row[RepresentativesFieldsEnum.REPRESENTATIVE_OPTION]
        .toString()
        .trim(),
    }

    return await RepresentativeRepository.createOrUpdate(representativeData, tx)
  }

  /**
   * Find Representative by name
   * @param {FormSubmissionEntryData} row - Row submission
   * @returns {Promise<Representative | null>} Representative
   */
  static async find(
    row: FormSubmissionEntryData,
  ): Promise<Representative | null> {
    const representativeName = row[
      RepresentativesFieldsEnum.REPRESENTATIVE_OPTION
    ]
      ?.toString()
      .trim()
    if (!representativeName) {
      return null
    }
    return await RepresentativeRepository.findByName(representativeName)
  }
}
