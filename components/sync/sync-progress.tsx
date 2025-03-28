'use client'

import { useState } from 'react'
import { useSyncProgress } from '@/lib/hooks/use-sync-progress'
import {
  PusherBatchProgress,
  SyncJobProgress,
} from '@/types/services/sync.types'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2, XCircle, XCircleIcon } from 'lucide-react'

interface SyncProgressProps {
  dashboardId: string
  onComplete?: () => void
  onClose?: () => void
}

export function SyncProgress({
  dashboardId,
  onComplete,
  onClose,
}: SyncProgressProps) {
  const [batchProgress, setBatchProgress] =
    useState<PusherBatchProgress | null>(null)
  const [jobProgress, setJobProgress] = useState<SyncJobProgress | null>(null)

  useSyncProgress({
    dashboardId,
    onBatchProgress: (progress) => {
      setBatchProgress(progress)
      if (progress && progress.completedJobs === progress.totalJobs) {
        onComplete?.()
      }
    },
    onJobProgress: setJobProgress,
  })

  if (!batchProgress) {
    return null
  }

  const progress = (batchProgress.completedJobs / batchProgress.totalJobs) * 100

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>Progreso de Sincronización</CardTitle>
        <div
          className="absolute right-4 top-4 hover:cursor-pointer"
          onClick={onClose}
        >
          <XCircleIcon className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progreso General</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm">Válidos</span>
            </div>
            <span className="text-2xl font-bold">
              {batchProgress.completedJobs}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">Pendientes</span>
            </div>
            <span className="text-2xl font-bold">
              {batchProgress.pendingJobs}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm">Fallidos</span>
            </div>
            <span className="text-2xl font-bold">
              {batchProgress.failedJobs}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Pendientes</span>
            </div>
            <span className="text-2xl font-bold">
              {batchProgress.pendingJobs}
            </span>
          </div>
        </div>

        {jobProgress?.error && (
          <Alert variant="destructive">
            <AlertDescription>{jobProgress.error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
