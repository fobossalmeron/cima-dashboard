import { Representative } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export class RepresentativeRepository {
  static async createOrUpdate(
    representative: Omit<Representative, 'createdAt' | 'updatedAt'>,
    tx?: Prisma.TransactionClient,
  ): Promise<Representative> {
    const client = tx ?? prisma
    return client.representative.upsert({
      where: { id: representative.id },
      update: {
        name: representative.name,
      },
      create: representative,
    })
  }
}
