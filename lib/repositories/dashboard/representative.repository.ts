import { Representative } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export class RepresentativeRepository {
  static async createOrUpdate(
    representative: Omit<Representative, 'createdAt' | 'updatedAt' | 'id'>,
    tx?: Prisma.TransactionClient,
  ): Promise<Representative> {
    const client = tx ?? prisma
    const representativeExists = await client.representative.findFirst({
      where: { name: representative.name },
    })
    if (representativeExists) {
      return representativeExists
    }
    return client.representative.create({
      data: representative,
    })
  }

  static async findByName(
    name: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Representative | null> {
    const client = tx ?? prisma
    return await client.representative.findFirst({
      where: { name },
    })
  }
}
