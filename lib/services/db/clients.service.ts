import { prisma } from '@/lib/prisma'
import { Client, Prisma } from '@prisma/client'
import {
  CreateClientRequest,
  ClientWithRelations,
  DashboardWithRelations,
  CreateClientResponse,
} from '@/types/api/clients'
import { withTransaction } from '@/prisma/prisma'

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
    tx?: Prisma.TransactionClient,
  ): Promise<Client> {
    if (tx) {
      return await tx.client.update({
        where: { id },
        data,
      })
    } else {
      return await prisma.client.update({
        where: { id },
        data,
      })
    }
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

  private static async createClient(
    tx: Prisma.TransactionClient,
    data: CreateClientRequest,
  ): Promise<Client> {
    return tx.client.create({
      data: {
        name: data.name,
        slug: data.slug,
      },
    })
  }

  static async create(
    data: CreateClientRequest,
    tx?: Prisma.TransactionClient,
  ): Promise<CreateClientResponse> {
    if (tx) {
      const client = await this.createClient(tx, data)

      return {
        client,
      }
    } else {
      // Crear usuario y cliente en una transacción
      const result = await withTransaction(async (tx) => {
        // Crear el cliente
        const client = await this.createClient(tx, data)

        return {
          client,
        }
      })

      return result
    }
  }

  static async createOrUpdate(
    data: CreateClientRequest,
    tx?: Prisma.TransactionClient,
  ): Promise<CreateClientResponse> {
    const client = await this.findBySlug(data.slug)
    if (client) {
      const clientUpdated = await this.update(client.id, data)
      return {
        client: clientUpdated,
      }
    } else {
      return await this.create(data, tx)
    }
  }
}
