import { PhotosFieldsEnum, PhotoTypesEnum } from '@/enums/photos-fields'
import { PhotoTypeRepository } from '@/lib/repositories'
import { PhotoRepository } from '@/lib/repositories/dashboard/photo.repository'
import { FormSubmissionEntryData } from '@/types/api'
import { Photo, Prisma } from '@prisma/client'

export class PhotosService {
  static async createOrUpdate(
    row: FormSubmissionEntryData,
    submissionId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<(Photo | null)[]> {
    const productPhotoValue = row[PhotosFieldsEnum.PRODUCT]
    const promotorPhotoValue = row[PhotosFieldsEnum.PROMOTOR]
    const clientsPhotoValues = Object.entries(row).filter(([key]) =>
      key.includes(PhotosFieldsEnum.CLIENTS),
    )
    const otherPhotoValues = Object.entries(row).filter(([key]) =>
      key.includes(PhotosFieldsEnum.OTHER),
    )

    const types = (await PhotoTypeRepository.getAll()).reduce((acc, type) => {
      acc[type.slug] = type.id
      return acc
    }, {} as Record<string, string>)

    let productPhoto: Photo | null = null
    if (productPhotoValue) {
      productPhoto = await PhotoRepository.createOrUpdate(
        {
          url: productPhotoValue?.toString() ?? '',
          typeId: types[PhotoTypesEnum.PRODUCT],
          submissionId,
        },
        tx,
      )
    }

    let promotorPhoto: Photo | null = null
    if (promotorPhotoValue) {
      promotorPhoto = await PhotoRepository.createOrUpdate(
        {
          url: promotorPhotoValue?.toString() ?? '',
          typeId: types[PhotoTypesEnum.PROMOTOR],
          submissionId,
        },
        tx,
      )
    }

    const clientsPhotos = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      clientsPhotoValues.map(async ([_, value]) => {
        return await PhotoRepository.createOrUpdate(
          {
            url: value?.toString() ?? '',
            typeId: types[PhotoTypesEnum.CLIENT],
            submissionId,
          },
          tx,
        )
      }),
    )

    const otherPhotos = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      otherPhotoValues.map(async ([_, value]) => {
        return await PhotoRepository.createOrUpdate(
          {
            url: value?.toString() ?? '',
            typeId: types[PhotoTypesEnum.OTHER],
            submissionId,
          },
          tx,
        )
      }),
    )

    return [productPhoto, promotorPhoto, ...clientsPhotos, ...otherPhotos]
  }
}
