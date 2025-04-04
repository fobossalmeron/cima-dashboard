import { Location, Prisma } from '@prisma/client'
import { FormSubmissionEntryData } from '@/types/api'
import { GeneralFieldsEnum } from '@/enums/general-fields'
import { LocationRepository } from '@/lib/repositories'

export class LocationService {
  /**
   * Process Location from row submission
   * @param {FormSubmissionEntryData} row - Row submission
   * @param {Prisma.TransactionClient} tx - Transaction client
   * @returns {Promise<Location>} Location
   */
  static async processLocation(
    row: FormSubmissionEntryData,
    tx?: Prisma.TransactionClient,
  ) {
    const latitude = row[GeneralFieldsEnum.LOCATION_LATITUDE]?.toString() || ''
    const longitude =
      row[GeneralFieldsEnum.LOCATION_LONGITUDE]?.toString() || ''
    const code = latitude.replace(/,|-/g, '') + longitude.replace(/,|-/g, '')
    const locationData = {
      id: code,
      code,
      name: row[GeneralFieldsEnum.LOCATION_NAME]?.toString() || '',
      address: row[GeneralFieldsEnum.LOCATION_ADDRESS]?.toString() || '',
      postalCode: row[GeneralFieldsEnum.LOCATION_POSTAL_CODE]?.toString() || '',
      city: row[GeneralFieldsEnum.LOCATION_CITY]?.toString() || '',
      state: row[GeneralFieldsEnum.LOCATION_STATE]?.toString() || '',
      country: row[GeneralFieldsEnum.LOCATION_COUNTRY]?.toString() || '',
      latitude: parseFloat(
        row[GeneralFieldsEnum.LOCATION_LATITUDE]
          ?.toString()
          .replace(',', '.') || '0',
      ),
      longitude: parseFloat(
        row[GeneralFieldsEnum.LOCATION_LONGITUDE]
          ?.toString()
          .replace(',', '.') || '0',
      ),
    }

    return await LocationRepository.createOrUpdate(locationData, tx)
  }

  static async find(row: FormSubmissionEntryData): Promise<Location | null> {
    const latitude = row[GeneralFieldsEnum.LOCATION_LATITUDE]?.toString() || ''
    const longitude =
      row[GeneralFieldsEnum.LOCATION_LONGITUDE]?.toString() || ''
    const code = latitude.replace(/,|-/g, '') + longitude.replace(/,|-/g, '')
    return await LocationRepository.getById(code)
  }
}
