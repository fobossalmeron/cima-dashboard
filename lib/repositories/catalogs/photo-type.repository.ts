import { prisma } from '@/lib/prisma'

export class PhotoTypeRepository {
  static async getAll() {
    return await prisma.photoType.findMany()
  }
}
