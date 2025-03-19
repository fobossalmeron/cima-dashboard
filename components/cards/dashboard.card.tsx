import Link from 'next/link'
import { Loader2, RefreshCcw, Trash } from 'lucide-react'
import { DashboardWithClientAndTemplate } from '@/types/api'
import { Button, Card, CardContent } from '@/components/ui'

interface DashboardCardProps {
  dashboard: DashboardWithClientAndTemplate
  onSyncDashboard: (dashboardId: string) => void
  onClearDashboard: (dashboardId: string) => void
  isSyncing: boolean
  isCleaning: boolean
}

export function DashboardCard({
  dashboard,
  onSyncDashboard,
  onClearDashboard,
  isSyncing,
  isCleaning,
}: DashboardCardProps) {
  return (
    <Card>
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <h3 className="font-medium">{dashboard.client.name}</h3>
          <p className="text-sm text-gray-600">
            Formulario: {dashboard.template.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => onClearDashboard(dashboard.id)}
            variant="destructive"
            disabled={isCleaning}
          >
            {isCleaning ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash className="mr-2 h-4 w-4" />
            )}
            Limpiar
          </Button>
          <Button
            onClick={() => onSyncDashboard(dashboard.id)}
            disabled={isSyncing}
            variant="primary-outline"
          >
            <div className="flex items-center">
              {isSyncing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="mr-2 h-4 w-4" />
              )}
              {isSyncing ? 'Sincronizando...' : 'Resync'}
            </div>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/${dashboard.client.slug}`}>Ir a dashboard</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
