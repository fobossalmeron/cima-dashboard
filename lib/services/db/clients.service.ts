import { prisma } from '@/lib/prisma'
import {
  ClientWithRelations,
  CreateClientRequest,
  CreateClientResponse,
} from '@/types/api/clients'
import { Client, Prisma, Role, User } from '@prisma/client'
import { hash } from 'bcryptjs'

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
    })

    return {
      ...client,
      dashboard,
    }
  }

  private static async createUser(
    tx: Prisma.TransactionClient,
    data: CreateClientRequest,
  ): Promise<User> {
    const password = Math.random().toString(36).slice(-8)
    const hashedPassword = await hash(password, 10)
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
