import { Location } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export class LocationService {
  static async createOrUpdate(
    location: Omit<Location, 'createdAt' | 'updatedAt'>,
    tx?: Prisma.TransactionClient,
  ): Promise<Location> {
    const client = tx ?? prisma
    const { id, ...locationDataWithoutId } = location
    return client.location.upsert({
      where: { id },
      update: locationDataWithoutId,
      create: location,
    })
  }
}
