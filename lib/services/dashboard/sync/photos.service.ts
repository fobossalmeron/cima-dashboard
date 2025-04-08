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

    await PhotoRepository.deleteBySubmissionAndType(
      submissionId,
      types[PhotoTypesEnum.PRODUCT],
      tx,
    )

    let productPhoto: Photo | null = null
    if (productPhotoValue) {
      productPhoto = await PhotoRepository.create(
        {
          url: productPhotoValue?.toString() ?? '',
          type: {
            connect: {
              id: types[PhotoTypesEnum.PRODUCT],
            },
          },
          submission: {
            connect: {
              id: submissionId,
            },
          },
        },
        tx,
      )
    }

    await PhotoRepository.deleteBySubmissionAndType(
      submissionId,
      types[PhotoTypesEnum.PROMOTOR],
      tx,
    )

    let promotorPhoto: Photo | null = null
    if (promotorPhotoValue) {
      promotorPhoto = await PhotoRepository.create(
        {
          url: promotorPhotoValue?.toString() ?? '',
          type: {
            connect: {
              id: types[PhotoTypesEnum.PROMOTOR],
            },
          },
          submission: {
            connect: {
              id: submissionId,
            },
          },
        },
        tx,
      )
    }

    await PhotoRepository.deleteBySubmissionAndType(
      submissionId,
      types[PhotoTypesEnum.CLIENT],
      tx,
    )

    const clientsPhotos = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      clientsPhotoValues.map(async ([_, value]) => {
        return await PhotoRepository.create(
          {
            url: value?.toString() ?? '',
            type: {
              connect: {
                id: types[PhotoTypesEnum.CLIENT],
              },
            },
            submission: {
              connect: {
                id: submissionId,
              },
            },
          },
          tx,
        )
      }),
    )

    await PhotoRepository.deleteBySubmissionAndType(
      submissionId,
      types[PhotoTypesEnum.OTHER],
      tx,
    )

    const otherPhotos = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      otherPhotoValues.map(async ([_, value]) => {
        return await PhotoRepository.create(
          {
            url: value?.toString() ?? '',
            type: {
              connect: {
                id: types[PhotoTypesEnum.OTHER],
              },
            },
            submission: {
              connect: {
                id: submissionId,
              },
            },
          },
          tx,
        )
      }),
    )

    return [productPhoto, promotorPhoto, ...clientsPhotos, ...otherPhotos]
  }
}
