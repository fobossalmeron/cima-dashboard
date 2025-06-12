import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export class GiveawayProductTypesRepository {
  static async getGiveawayProductTypes(dashboardId?: string) {
    const baseQuery: Prisma.GiveawayProductTypeFindManyArgs = {
      where: {
        giveawayProducts: {
          some: {
            submission: {
              dashboardId,
            },
          },
        },
      },
    }
    return await prisma.giveawayProductType.findMany(baseQuery)
  }
}
