import { useEffect, useState } from 'react'
import { usePusher } from './use-pusher'
import { BatchProgress, SyncJobProgress } from '@/types/services/sync.types'

interface UseSyncProgressProps {
  batchId?: string
  jobId?: string
  dashboardId?: string
  onBatchProgress?: (progress: BatchProgress) => void
  onJobProgress?: (progress: SyncJobProgress) => void
}

export function useSyncProgress({
  batchId,
  jobId,
  dashboardId,
  onBatchProgress,
  onJobProgress,
}: UseSyncProgressProps) {
  const { pusher } = usePusher()
  const [isConnected, setIsConnected] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    if (!pusher) {
      console.log('Pusher no está inicializado')
      return
    }

    // Manejar eventos de conexión
    pusher.connection.bind('connected', () => {
      console.log('Pusher conectado')
      setIsConnected(true)
    })

    pusher.connection.bind('disconnected', () => {
      console.log('Pusher desconectado')
      setIsConnected(false)
    })

    // Suscribirse al canal
    const channel = pusher.subscribe('sync-progress')

    // Manejar eventos de suscripción
    channel.bind('pusher:subscription_succeeded', () => {
      setIsSubscribed(true)
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    channel.bind('pusher:subscription_error', (error: any) => {
      console.error('Error al suscribirse al canal:', error)
      setIsSubscribed(false)
    })

    const handleBatchProgress = (data: BatchProgress) => {
      console.log('Recibido batch-progress:', data)
      // Si tenemos un dashboardId, solo procesar eventos de ese dashboard
      if (dashboardId && data.dashboardId !== dashboardId) return
      // Si tenemos un batchId, solo procesar eventos de ese batch
      if (batchId && data.batchId !== batchId) return
      onBatchProgress?.(data)
    }

    const handleJobProgress = (data: SyncJobProgress) => {
      console.log('Recibido job-progress:', data)
      // Si tenemos un dashboardId, solo procesar eventos de ese dashboard
      if (dashboardId && data.dashboardId !== dashboardId) return
      // Si tenemos un jobId, solo procesar eventos de ese job
      if (jobId && data.jobId !== jobId) return
      onJobProgress?.(data)
    }

    channel.bind('batch-progress', handleBatchProgress)
    channel.bind('job-progress', handleJobProgress)

    // Cleanup
    return () => {
      channel.unbind('pusher:subscription_succeeded')
      channel.unbind('pusher:subscription_error')
      channel.unbind('batch-progress', handleBatchProgress)
      channel.unbind('job-progress', handleJobProgress)
      pusher.unsubscribe('sync-progress')
      setIsSubscribed(false)
    }
  }, [pusher, batchId, jobId, dashboardId, onBatchProgress, onJobProgress])

  return {
    isConnected,
    isSubscribed,
  }
}
