import { prisma } from '@/lib/prisma'
import { SyncJobStatus } from '@prisma/client'
import { Log } from '@/lib/utils/log'

async function processLocalJobs() {
  try {
    const pendingJobs = await prisma.syncJob.count({
      where: { status: SyncJobStatus.PENDING },
    })

    if (pendingJobs === 0) {
      Log.info('No pending jobs to process')
      return
    }

    Log.info(`Found ${pendingJobs} pending jobs`)

    // Hacer una petición GET a /api/sync/process-local
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/sync/process-local`,
    )
    const result = await response.json()

    Log.info('Job processed', result)

    // Esperar 1 segundo antes de procesar el siguiente
    setTimeout(processLocalJobs, 1000)
  } catch (error) {
    Log.error('Error processing local jobs', { error })
    process.exit(1)
  }
}

processLocalJobs()
