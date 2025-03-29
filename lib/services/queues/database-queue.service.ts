import { Log } from '@/lib/utils/log'
import { QStashMessage } from '@/types/services/sync.types'
import { prisma } from '@/lib/prisma'
import { SyncJobStatus } from '@prisma/client'

export class DatabaseQueueService {
  static async addToQueue(message: QStashMessage) {
    // Actualizar el job a PENDING
    await prisma.syncJob.update({
      where: { id: message.jobId },
      data: { status: SyncJobStatus.PENDING },
    })

    Log.info('Sync job added to local queue', { jobId: message.jobId })
    return { messageId: message.jobId }
  }

  static async getNextJob() {
    // Obtener el siguiente job pendiente
    const job = await prisma.syncJob.findFirst({
      where: { status: SyncJobStatus.PENDING },
      orderBy: { createdAt: 'asc' },
    })

    if (!job) {
      return null
    }

    // Actualizar el job a PROCESSING
    await prisma.syncJob.update({
      where: { id: job.id },
      data: { status: SyncJobStatus.PROCESSING },
    })

    return job
  }
}
