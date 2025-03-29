import { prisma } from '@/lib/prisma'
import { SyncJob } from '@prisma/client'

export class SyncJobRepository {
  static async getById(id: string): Promise<SyncJob | null> {
    return prisma.syncJob.findUnique({
      where: { id },
    })
  }
}
