import { prisma } from '@/lib/prisma'
import { Client } from '@prisma/client'

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
}
