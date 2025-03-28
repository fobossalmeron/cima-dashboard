import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
export class DashboardRepository {
  static async getById(id: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma
    const dashboard = await client.dashboard.findUnique({
      where: { id },
    })

    return dashboard
  }
}
