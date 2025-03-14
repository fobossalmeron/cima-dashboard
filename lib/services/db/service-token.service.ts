import { prisma } from '@/lib/prisma'
import { ServiceToken } from '@prisma/client'

export class ServiceTokenService {
  static async getAll(): Promise<ServiceToken[]> {
    return await prisma.serviceToken.findMany()
  }

  static async getById(id: string): Promise<ServiceToken | null> {
    return await prisma.serviceToken.findUnique({
      where: { id },
    })
  }

  static async create(
    data: Omit<ServiceToken, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ServiceToken> {
    return await prisma.serviceToken.create({
      data,
    })
  }

  static async update(
    id: string,
    data: Partial<ServiceToken>,
  ): Promise<ServiceToken> {
    return await prisma.serviceToken.update({
      where: { id },
      data,
    })
  }

  static async remove(id: string): Promise<ServiceToken> {
    return await prisma.serviceToken.delete({
      where: { id },
    })
  }

  static async findByToken(
    service: string,
    id: string,
  ): Promise<ServiceToken | null> {
    return await prisma.serviceToken.findUnique({
      where: {
        id,
        service,
      },
    })
  }
}
