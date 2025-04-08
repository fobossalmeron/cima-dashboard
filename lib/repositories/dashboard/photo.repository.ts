import { prisma } from '@/lib/prisma'
import { CreatePhotoParams } from '@/types/services'
import { Prisma } from '@prisma/client'

export class PhotoRepository {
  static async getUnique(data: Omit<CreatePhotoParams, 'url'>) {
    return await prisma.photo.findFirst({
      where: {
        submissionId: data.submissionId,
        typeId: data.typeId,
      },
    })
  }

  static async createOrUpdate(
    data: CreatePhotoParams,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? prisma
    const photo = await this.getUnique(data)
    if (photo) {
      return await client.photo.update({
        where: { id: photo.id },
        data: {
          url: data.url,
        },
      })
    }
    return await client.photo.create({
      data,
    })
  }

  static async create(
    data: Prisma.PhotoCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? prisma
    return await client.photo.create({ data })
  }

  static async deleteBySubmissionAndType(
    submissionId: string,
    typeId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? prisma
    return await client.photo.deleteMany({
      where: { submissionId, typeId },
    })
  }
}
