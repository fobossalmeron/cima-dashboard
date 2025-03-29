import { Client } from '@upstash/qstash'
import { Log } from '@/lib/utils/log'
import { QStashMessage } from '@/types/services/sync.types'
import { DatabaseQueueService } from './database-queue.service'
import { RetryService } from './retry.service'

if (!process.env.QSTASH_TOKEN) {
  throw new Error('QSTASH_TOKEN is not defined')
}

if (!process.env.QSTASH_CURRENT_SIGNING_KEY) {
  throw new Error('QSTASH_CURRENT_SIGNING_KEY is not defined')
}

if (!process.env.QSTASH_NEXT_SIGNING_KEY) {
  throw new Error('QSTASH_NEXT_SIGNING_KEY is not defined')
}

if (!process.env.QSTASH_URL) {
  throw new Error('QSTASH_URL is not defined')
}

export const qstash = new Client({
  token: process.env.QSTASH_TOKEN,
  baseUrl: process.env.QSTASH_URL,
})

export class QueueService {
  static async publishSyncJob(message: QStashMessage) {
    try {
      // Add job to Database for backup
      const localJob = await DatabaseQueueService.addToQueue(message)

      if (process.env.NODE_ENV === 'production') {
        // In production, use QStash with retries configuration
        const result = await qstash.publishJSON({
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/sync/process`,
          body: message,
          retries: 3, // Number of retries
          retryDelay: '1s', // Delay between retries
          deduplicationId: message.jobId, // Avoid duplicates
          notBefore: 0, // Execute immediately
        })

        Log.info('Sync job published to QStash', {
          jobId: message.jobId,
          retries: 3,
          retryDelay: '1s',
        })
        return result
      }

      return localJob
    } catch (error) {
      Log.error('Error publishing sync job', { error, jobId: message.jobId })
      throw error
    }
  }

  static async handleFailedJob(jobId: string): Promise<void> {
    await RetryService.handleFailedJob(jobId)
  }
}
