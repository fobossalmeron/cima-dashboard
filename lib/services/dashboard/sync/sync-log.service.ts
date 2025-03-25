import { prisma } from '@/prisma/prisma'
import { SyncStatus } from '@prisma/client'

export class SyncLogService {
  static async create(dashboardId: string, status: SyncStatus, error?: string) {
    await prisma.syncLog.create({
      data: { dashboardId, status, error },
    })
  }
}
