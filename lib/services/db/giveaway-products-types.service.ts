import { prisma } from '@/lib/prisma'
import { DashboardService } from '../dashboard'
import { QuestionRepository } from '@/lib/repositories'
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

    // Get the template questions
    const templateQuestions = await QuestionRepository.getTemplateQuestions(
      dashboard.templateId,
    )

    // Get the giveaway question
    const giveawayQuestion = templateQuestions.find((question) =>
      question.name.includes('REGALOS PROMOCIONALES'),
    )

    if (!giveawayQuestion) {
      throw new Error('Giveaway question not found')
    }

    return giveawayQuestion.options
      .filter((option) => option.value !== 'Ninguno')
      .map((option) => ({
        value: slugify(option.value),
        label: option.value,
      }))
  }
}
