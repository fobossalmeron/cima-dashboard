/* eslint-disable @typescript-eslint/no-unused-vars */
import { PhotosFieldsEnum, PhotoTypesEnum } from '@/enums/photos-fields'
import { prisma } from '@/lib/prisma'
import { FormSubmissionEntryData } from '@/types/api'
import { CreatePhotoParams } from '@/types/services/photos.types'
import { Photo, Prisma } from '@prisma/client'

export class PhotosService {
  static async getAllTypes() {
    return await prisma.photoType.findMany()
  }

  private static async processPhoto(
    data: CreatePhotoParams,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || prisma
    return await client.photo.create({
      data,
    })
  }

  static async processPhotos(
    row: FormSubmissionEntryData,
    submissionId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Photo[]> {
    const productPhotoValue = row[PhotosFieldsEnum.PRODUCT]
    const promotorPhotoValue = row[PhotosFieldsEnum.PROMOTOR]
    const clientsPhotoValues = Object.entries(row).filter(([key]) =>
      key.includes(PhotosFieldsEnum.CLIENTS),
    )
    const otherPhotoValues = Object.entries(row).filter(([key]) =>
      key.includes(PhotosFieldsEnum.OTHER),
    )

    const types = (await this.getAllTypes()).reduce((acc, type) => {
      acc[type.slug] = type.id
      return acc
    }, {} as Record<string, string>)

    const productPhoto = await this.processPhoto(
      {
        url: productPhotoValue?.toString() ?? '',
        typeId: types[PhotoTypesEnum.PRODUCT],
        submissionId,
      },
      tx,
    )

    const promotorPhoto = await this.processPhoto(
      {
        url: promotorPhotoValue?.toString() ?? '',
        typeId: types[PhotoTypesEnum.PROMOTOR],
        submissionId,
      },
      tx,
    )

    const clientsPhotos = await Promise.all(
      clientsPhotoValues.map(async ([_, value]) => {
        return await this.processPhoto(
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
      otherPhotoValues.map(async ([_, value]) => {
        return await this.processPhoto(
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
