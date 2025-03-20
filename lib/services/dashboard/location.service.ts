import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export class LocationService {
  static async getAll(tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma
    return await client.location.findMany()
  }

  static async getById(id: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma
    return await client.location.findUnique({
      where: { id },
    })
  }

  static async getByCode(code: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma
    return await client.location.findUnique({
      where: { code },
    })
  }

  static async getUniqueCities(tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma
    const locations = await client.location.findMany({
      select: {
        city: true,
      },
      distinct: ['city'],
    })
    return locations.map((location) => location.city)
  }

  static async create(
    data: {
      code: string
      name: string
      address: string
      postalCode: string
      city: string
      state: string
      country: string
      latitude: number
      longitude: number
    },
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? prisma
    return await client.location.create({
      data,
    })
  }

  static async update(
    id: string,
    data: Partial<{
      code: string
      name: string
      address: string
      postalCode: string
      city: string
      state: string
      country: string
      latitude: number
      longitude: number
    }>,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? prisma
    return await client.location.update({
      where: { id },
      data,
    })
  }

  static async delete(id: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma
    return await client.location.delete({
      where: { id },
    })
  }
}
