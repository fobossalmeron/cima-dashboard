import { FormSubmissionEntryData } from '@/types/api'
import { GeneralFieldsEnum } from '@/enums/general-fields'
import { DataFieldsEnum } from '@/enums/data-fields'
import { parseDate } from '@/lib/utils/date'

export class GeneralFieldsService {
  static async processGeneralFields(
    row: FormSubmissionEntryData,
    dashboardId: string,
  ) {
    // Process Dealer
    const dealerData = {
      name: row[GeneralFieldsEnum.DEALER_NAME]?.toString() || '',
      nameOther: row[GeneralFieldsEnum.OTHER_DEALER_NAME]?.toString() || '',
      sellerName: row[GeneralFieldsEnum.SELLER_NAME]?.toString() || '',
      sellerMobile: row[GeneralFieldsEnum.MOBILE_SELLER]?.toString() || '',
      sellerEmail: row[GeneralFieldsEnum.EMAIL_SELLER]?.toString() || '',
      notes: row[GeneralFieldsEnum.NOTES_SELLER]?.toString() || '',
    }

    const representativeData = {
      id: row[GeneralFieldsEnum.REPRESENTATIVE]?.toString() || '',
      name: row[GeneralFieldsEnum.REPRESENTATIVE_NAME]?.toString() || '',
    }

    const locationData = {
      id: row[GeneralFieldsEnum.LOCATION]?.toString() || '',
      code: row[GeneralFieldsEnum.LOCATION]?.toString() || '',
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

    const submittedAt = row[GeneralFieldsEnum.DATE]
      ? parseDate(row[GeneralFieldsEnum.DATE].toString())
      : new Date()

    const startDate = row[GeneralFieldsEnum.START_DATE]
      ? parseDate(row[GeneralFieldsEnum.START_DATE].toString())
      : new Date()
    const endDate = row[GeneralFieldsEnum.END_DATE]
      ? parseDate(row[GeneralFieldsEnum.END_DATE].toString())
      : new Date()

    // Procesar datos del FormSubmission
    const submissionData = {
      submittedAt,
      notes: row[GeneralFieldsEnum.NOTE]?.toString() ?? null,
      tags:
        row[GeneralFieldsEnum.TAGS]?.toString()?.split(',').filter(Boolean) ||
        [],
      email: row[GeneralFieldsEnum.EMAIL]?.toString() ?? null,
      phone: row[GeneralFieldsEnum.PHONE]?.toString() ?? null,
      mobilePhone: row[GeneralFieldsEnum.MOBILE]?.toString() ?? null,
      status: row[GeneralFieldsEnum.STATUS]?.toString() ?? null,
      registered:
        row[GeneralFieldsEnum.REGISTERED]?.toString()?.toLowerCase() === 'true',
      startDate,
      endDate,
      formLink: row[GeneralFieldsEnum.FORM_LINK]?.toString() ?? '',
      legalName: row[GeneralFieldsEnum.LEGAL_NAME]?.toString() ?? null,
      dashboardId,
    }

    const samplesDelivered = row[DataFieldsEnum.SAMPLES_DELIVERED]?.toString()
      ? Number(row[DataFieldsEnum.SAMPLES_DELIVERED]?.toString())
      : 0

    const pointOfSale = row[DataFieldsEnum.POINT_OF_SALE]?.toString()

    const productInPromotion =
      row[DataFieldsEnum.PRODUCT_IN_PROMOTION]?.toString()?.toLowerCase() ===
      'Yes'

    const riskZone =
      row[DataFieldsEnum.RISK_ZONE]?.toString()?.toLowerCase() === 'Yes'

    // Filtrar los campos que son preguntas
    const questionAnswers = Object.fromEntries(
      Object.entries(row).filter(
        ([key]) =>
          !Object.values(GeneralFieldsEnum).includes(key as GeneralFieldsEnum),
      ),
    )

    return {
      dealerData,
      representativeData,
      locationData,
      submissionData,
      questionAnswers,
      samplesDelivered,
      pointOfSale,
      productInPromotion,
      riskZone,
    }
  }
}
