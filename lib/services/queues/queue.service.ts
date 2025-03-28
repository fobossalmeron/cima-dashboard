import { Client } from '@upstash/qstash'
import { Log } from '@/lib/utils/log'
import { QStashMessage } from '@/types/services/sync.types'
import { LocalQueueService } from './local-queue.service'
import { RetryService } from './retry.service'

if (!process.env.QSTASH_QSTASH_TOKEN) {
  throw new Error('QSTASH_TOKEN is not defined')
}

if (!process.env.QSTASH_QSTASH_CURRENT_SIGNING_KEY) {
  throw new Error('QSTASH_CURRENT_SIGNING_KEY is not defined')
}

if (!process.env.QSTASH_QSTASH_NEXT_SIGNING_KEY) {
  throw new Error('QSTASH_NEXT_SIGNING_KEY is not defined')
}

if (!process.env.QSTASH_QSTASH_URL) {
  throw new Error('QSTASH_URL is not defined')
}

export const qstash = new Client({
  token: process.env.QSTASH_QSTASH_TOKEN,
  baseUrl: process.env.QSTASH_QSTASH_URL,
})

export class QueueService {
  static async publishSyncJob(message: QStashMessage) {
    try {
      // En desarrollo, usar cola local
      if (process.env.NODE_ENV === 'development') {
        return LocalQueueService.addToQueue(message)
      }

      // En producción, usar QStash
      const result = await qstash.publishJSON({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/sync/process`,
        body: message,
      })
      Log.info('Sync job published to QStash', { jobId: message.jobId })
      return result
    } catch (error) {
      Log.error('Error publishing sync job', { error, jobId: message.jobId })
      throw error
    }
  }

  static async handleFailedJob(jobId: string): Promise<void> {
    await RetryService.handleFailedJob(jobId)
  }
}
