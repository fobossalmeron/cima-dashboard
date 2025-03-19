import { prisma } from '@/lib/prisma'
import { Role } from '@/enums/role'
import { Client, Prisma } from '@prisma/client'
import {
  CreateClientRequest,
  ClientWithRelations,
  DashboardWithRelations,
} from '@/types/api/clients'
import { AuthService } from '../auth'

export class ClientsService {
  static async getAll(): Promise<Client[]> {
    return await prisma.client.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })
  }

  static async getById(id: string): Promise<Client | null> {
    return await prisma.client.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })
  }

  static async getBySlug(slug: string): Promise<ClientWithRelations | null> {
    const client = await prisma.client.findUnique({
      where: { slug },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    if (!client) {
      return null
    }

    const dashboard = await prisma.dashboard.findFirst({
      where: {
        clientId: client?.id,
      },
      include: {
        template: {
          include: {
            questionGroups: true,
            questions: {
              include: {
                options: true,
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
          },
        },
      },
    })

    return {
      ...client,
      dashboard: dashboard as DashboardWithRelations | null,
    }
  }

  static async create(data: CreateClientRequest): Promise<Client> {
    return await prisma.$transaction(async (tx) => {
      const user = await this.createUser(tx, data)

      const client = await tx.client.create({
        data: {
          name: data.name,
          slug: data.slug,
          userId: user.id,
        },
      })

      return client
    })
  }

  static async update(
    id: string,
    data: Partial<{
      name: string
      slug: string
    }>,
  ): Promise<Client> {
    return await prisma.client.update({
      where: { id },
      data,
    })
  }

  static async remove(id: string): Promise<Client> {
    return await prisma.client.delete({
      where: { id },
    })
  }

  static async findBySlug(slug: string): Promise<Client | null> {
    return await prisma.client.findUnique({
      where: { slug },
    })
  }

  private static async createUser(
    tx: Prisma.TransactionClient,
    data: CreateClientRequest,
  ) {
    const password = Math.random().toString(36).slice(-8)
    const hashedPassword = await AuthService.hashPassword(password)
    return tx.user.create({
      data: {
        email: `${data.slug}@example.com`,
        password: hashedPassword,
        role: Role.CLIENT,
      },
    })
  }
}
