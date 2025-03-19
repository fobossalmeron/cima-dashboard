import { prisma } from '@/lib/prisma'
import { Dashboard } from '@prisma/client'
import { DashboardWithClientAndTemplate } from '@/types/api'
import { AnswerService } from './answer.service'
import { ActivatedBrandService } from './activated-brand.service'
import { SubmissionService } from './submission.service'
import { ProductSaleService } from './product-sale.service'
import { SubBrandTemplateService } from '../form-templates'
import { withTransaction } from '@/prisma/prisma'

export class DashboardService {
  static async getAll(): Promise<DashboardWithClientAndTemplate[]> {
    return await prisma.dashboard.findMany({
      include: {
        client: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        template: true,
      },
    })
  }

  static async getById(id: string): Promise<Dashboard | null> {
    return await prisma.dashboard.findUnique({
      where: { id },
      include: {
        client: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })
  }

  static async create(
    data: Omit<Dashboard, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Dashboard> {
    return await prisma.dashboard.create({
      data,
      include: {
        client: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })
  }

  static async update(
    id: string,
    data: Partial<Dashboard>,
  ): Promise<Dashboard> {
    return await prisma.dashboard.update({
      where: { id },
      data,
      include: {
        client: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })
  }

  static async remove(id: string): Promise<Dashboard> {
    return await prisma.dashboard.delete({
      where: { id },
      include: {
        client: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })
  }

  static async clear(id: string) {
    const dashboard = await DashboardService.getById(id)

    if (!dashboard) {
      throw new Error('Dashboard not found')
    }
    try {
      await withTransaction(async (tx) => {
        // Delete all answers
        await AnswerService.deleteByDashboardId(dashboard.id, tx)
        // Delete all activated brands
        await ActivatedBrandService.deleteByDashboardId(dashboard.id, tx)
        // Delete the submissions
        await SubmissionService.deleteByDashboardId(dashboard.id, tx)
        // Delete all product sales
        await ProductSaleService.deleteByDashboardId(dashboard.id, tx)
        // Delete all sub brand templates
        await SubBrandTemplateService.deleteByTemplateId(
          dashboard.templateId,
          tx,
        )
      })
    } catch (error) {
      console.error('Error clearing dashboard:', error)
    }
  }
}
