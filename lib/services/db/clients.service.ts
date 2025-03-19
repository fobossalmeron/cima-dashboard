import { prisma } from '@/lib/prisma'
import { Role } from '@/enums/role'
import { Client, Prisma, User } from '@prisma/client'
import {
  CreateClientRequest,
  ClientWithRelations,
  DashboardWithRelations,
  CreateClientResponse,
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
  ): Promise<User> {
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

  private static async createClient(
    tx: Prisma.TransactionClient,
    data: CreateClientRequest,
    user: User,
  ): Promise<Client> {
    return tx.client.create({
      data: {
        name: data.name,
        slug: data.slug,
        userId: user.id,
      },
    })
  }

  static async create(
    data: CreateClientRequest,
    tx?: Prisma.TransactionClient,
  ): Promise<CreateClientResponse> {
    if (tx) {
      const user = await this.createUser(tx, data)
      const client = await this.createClient(tx, data, user)

      return {
        user,
        client,
      }
    } else {
      // Crear usuario y cliente en una transacción
      const result = await prisma.$transaction(async (tx) => {
        // Crear el usuario
        const user = await this.createUser(tx, data)

        // Crear el cliente
        const client = await this.createClient(tx, data, user)

        return {
          user,
          client,
        }
      })

      return result
    }
  }
}
