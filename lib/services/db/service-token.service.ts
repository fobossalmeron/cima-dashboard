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
    service: string,
    data: Partial<{
      token: string
      refreshToken: string | null
      fingerprint: string | null
      expiresIn: number | null
      expiresAt: Date | null
    }>,
  ): Promise<ServiceToken> {
    const token = await prisma.serviceToken.update({
      where: { service },
      data,
    })

    return token
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

  static async findByService(service: string): Promise<ServiceToken | null> {
    return await prisma.serviceToken.findUnique({
      where: { service },
    })
  }
}
