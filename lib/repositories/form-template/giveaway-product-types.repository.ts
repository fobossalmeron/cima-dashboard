import { prisma } from '@/lib/prisma'

export class GiveawayProductTypesRepository {
  static async getGiveawayProductTypes() {
    return await prisma.giveawayProductType.findMany()
  }
}
