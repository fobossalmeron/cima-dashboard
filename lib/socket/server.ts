import { PusherBatchProgress, SyncJobProgress } from '@/types/services'
import Pusher from 'pusher'
import { Log } from '@/lib/utils/log'

export class SocketServer {
  private static instance: Pusher | null = null
  private static readonly CHANNEL = 'sync-progress'

  private static initialize() {
    if (this.instance) {
      return this.instance
    }

    try {
      if (!process.env.PUSHER_APP_ID) {
        throw new Error('PUSHER_APP_ID is not defined')
      }

      if (!process.env.PUSHER_KEY) {
        throw new Error('PUSHER_KEY is not defined')
      }

      if (!process.env.PUSHER_SECRET) {
        throw new Error('PUSHER_SECRET is not defined')
      }

      if (!process.env.PUSHER_CLUSTER) {
        throw new Error('PUSHER_CLUSTER is not defined')
      }

      this.instance = new Pusher({
        appId: process.env.PUSHER_APP_ID,
        key: process.env.PUSHER_KEY,
        secret: process.env.PUSHER_SECRET,
        cluster: process.env.PUSHER_CLUSTER,
        useTLS: true,
      })

      return this.instance
    } catch (error) {
      Log.error('Error initializing Pusher', { error })
      throw error
    }
  }

  private static getInstance(): Pusher {
    if (!this.instance) {
      this.instance = this.initialize()
    }
    return this.instance
  }

  static emitBatchProgress(batchId: string, progress: PusherBatchProgress) {
    try {
      this.getInstance().trigger(this.CHANNEL, 'batch-progress', progress)
    } catch (error) {
      Log.error('Error emitting batch progress', { error, batchId })
      throw error
    }
  }

  static emitJobProgress(jobId: string, progress: SyncJobProgress) {
    try {
      this.getInstance().trigger(this.CHANNEL, 'job-progress', progress)
    } catch (error) {
      Log.error('Error emitting job progress', { error, jobId })
      throw error
    }
  }
}
