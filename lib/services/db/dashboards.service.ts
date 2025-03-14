import { prisma } from '@/lib/prisma'
import { DashboardWithClientAndTemplate } from '@/types/api'
import { Dashboard } from '@prisma/client'

export class DashboardsService {
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
}
