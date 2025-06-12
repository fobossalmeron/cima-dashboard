import { prisma } from '@/lib/prisma'
import { DashboardService } from '../dashboard'
import { GiveawayProductTypesRepository } from '@/lib/repositories'
import { Option } from '@/types'
import { slugify } from '@/lib/utils'

export class GiveawayProductsTypesService {
  static async getGiveawayProductsTypes() {
    return await prisma.giveawayProductType.findMany()
  }

  static async getGiveawayProductTypeBySlug(slug: string) {
    return await prisma.giveawayProductType.findUnique({ where: { slug } })
  }

  static async getGiveawayProductTypeByDashboardId(
    dashboardId: string,
  ): Promise<Option[]> {
    // Get the dashboard
    const dashboard = await DashboardService.getById(dashboardId)
    if (!dashboard) {
      throw new Error('Dashboard not found')
    }

    const giveawayProductTypes =
      await GiveawayProductTypesRepository.getGiveawayProductTypes(dashboard.id)

    return giveawayProductTypes.map((option) => ({
      value: slugify(option.slug),
      label: option.name,
    }))
  }
}
