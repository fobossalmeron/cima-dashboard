import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export class GiveawayProductTypeRepository {
  static async findUnique(slug: string) {
    return await prisma.giveawayProductType.findUnique({ where: { slug } })
  }

  static async createOrUpdate(
    name: string,
    slug: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || prisma
    return await client.giveawayProductType.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    })
  }

  static async findByQuestionOptions(options: string[]) {
    return await prisma.giveawayProductType.findMany({
      where: {
        slug: { in: options },
      },
    })
  }
}
