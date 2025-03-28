import { DashboardSyncService } from '@/lib/services/dashboard/sync/sync.service'
import { Log } from '@/lib/utils/log'

async function cleanupSyncJobs() {
  try {
    const result = await DashboardSyncService.cleanupOldJobs(7)
    Log.info('Sync jobs cleanup completed', result)
    process.exit(0)
  } catch (error) {
    Log.error('Error cleaning up sync jobs', { error })
    process.exit(1)
  }
}

cleanupSyncJobs()
