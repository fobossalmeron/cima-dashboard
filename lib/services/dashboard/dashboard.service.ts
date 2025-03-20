import { prisma } from '@/lib/prisma'
import { Dashboard, Prisma } from '@prisma/client'
import { DashboardWithClientAndTemplate } from '@/types/api'
import { AnswerService } from './answer.service'
import { ActivatedBrandService } from './activated-brand.service'
import { SubmissionService } from './submission.service'
import { ProductSaleService } from './product-sale.service'
import { SubBrandTemplateService } from '../form-templates'
import { withTransaction } from '@/prisma/prisma'
import { DashboardFilters } from '@/types/services/dashboard.types'
import { DashboardWithRelations } from '@/types/api/clients'

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

  static async getById(
    id: string,
    filters?: DashboardFilters,
  ): Promise<DashboardWithRelations | null> {
    const { dateRange, brandIds, city, locationId } = filters || {}

    const submissionsWhere: Prisma.FormSubmissionWhereInput = {}

    if (dateRange) {
      submissionsWhere.submittedAt = {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      }
    }

    if (brandIds?.length) {
      submissionsWhere.activatedBrands = { some: { brandId: { in: brandIds } } }
    }

    if (city) {
      submissionsWhere.location = { city }
    }

    if (locationId) {
      submissionsWhere.locationId = locationId
    }

    // Primero buscamos el dashboard por ID
    const dashboard = await prisma.dashboard.findFirst({
      where: { id },
      include: {
        template: {
          include: {
            questionGroups: true,
            questions: {
              include: {
                options: {
                  include: {
                    triggers: true,
                  },
                },
                attachments: true,
                triggers: true,
              },
            },
            subBrandTemplates: {
              include: {
                subBrand: {
                  include: {
                    brand: true,
                  },
                },
              },
            },
          },
        },
        // Incluimos las submissions con los filtros aplicados
        submissions: {
          where: submissionsWhere,
          include: {
            answers: true,
            location: true,
            representative: true,
            activatedBrands: {
              include: {
                brand: true,
              },
            },
            productSales: {
              include: {
                product: {
                  include: {
                    presentation: true,
                    brand: true,
                    subBrand: true,
                    flavor: true,
                  },
                },
              },
            },
            productLocation: true,
            pointOfSale: true,
          },
        },
      },
    })

    return dashboard
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
