import { prisma } from '@/lib/prisma'
import { Dashboard, Prisma, SyncJobStatus, SyncStatus } from '@prisma/client'
import { DashboardWithClientAndTemplate, DashboardWithLogs } from '@/types/api'
import { SubmissionService } from './submission.service'
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
        SyncJob: {
          where: {
            status: {
              in: [
                SyncJobStatus.PENDING,
                SyncJobStatus.PROCESSING,
                SyncJobStatus.FAILED,
              ],
            },
          },
        },
      },
    })
  }

  // Get all dashboards with the last successful sync log
  static async getAllWithLogs(): Promise<DashboardWithLogs[]> {
    return await prisma.dashboard.findMany({
      include: {
        syncLogs: {
          where: {
            status: SyncStatus.SUCCESS,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        client: true,
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
      submissionsWhere.startDate = {
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
            sampling: {
              include: {
                consumptionMoments: {
                  include: {
                    consumptionMoment: true,
                  },
                },
                purchaseIntentions: {
                  include: {
                    purchaseIntention: true,
                  },
                },
                traffic: true,
                gender: true,
                ageRange: true,
                ethnicity: true,
              },
            },
            photos: {
              include: {
                type: true,
              },
            },
          },
        },
        syncLogs: true,
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
      // Delete the submissions, all the related data will be deleted in cascade
      await SubmissionService.deleteByDashboardId(dashboard.id)
    } catch (error) {
      console.error('Error clearing dashboard:', error)
    }
  }

  static async hasPendingSync(id: string): Promise<boolean> {
    const syncLogs = await prisma.syncJob.findMany({
      where: {
        dashboardId: id,
        status: {
          in: [
            SyncJobStatus.PENDING,
            SyncJobStatus.PROCESSING,
            SyncJobStatus.FAILED,
          ],
        },
      },
    })
    return syncLogs.length > 0
  }
}
