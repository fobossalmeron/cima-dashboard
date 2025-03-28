import { Location } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export class LocationRepository {
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

  static async createOrUpdate(
    location: Omit<Location, 'createdAt' | 'updatedAt'>,
    tx?: Prisma.TransactionClient,
  ): Promise<Location> {
    const client = tx ?? prisma
    const { id, latitude, longitude, ...locationDataWithoutId } = location
    // Check if location exists by latitude and longitude
    const locationExists = await client.location.findFirst({
      where: { latitude, longitude },
    })
    if (locationExists && locationExists.id !== id) {
      // Update location
      return await client.location.update({
        where: { id: locationExists.id },
        data: {
          ...locationDataWithoutId,
          latitude: latitude,
          longitude: longitude,
        },
      })
    }
    // Create or update location by ID
    return client.location.upsert({
      where: { id },
      update: {
        ...locationDataWithoutId,
        latitude: latitude || undefined,
        longitude: longitude || undefined,
      },
      create: location,
    })
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
