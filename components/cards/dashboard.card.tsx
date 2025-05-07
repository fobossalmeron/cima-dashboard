import Link from 'next/link'
import { Loader2, MoreVertical, RefreshCcw, Trash } from 'lucide-react'
import { DashboardWithClientAndTemplate } from '@/types/api'
import { Button, Card, CardContent } from '@/components/ui'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

interface DashboardCardProps {
  dashboard: DashboardWithClientAndTemplate
  onSyncDashboard: (dashboardId: string) => void
  onClearDashboard: (dashboardId: string) => void
  onDeleteDashboard: (dashboardId: string) => void
  onUpdateTemplate: (templateId: string) => void
  isSyncing: boolean
  isCleaning: boolean
  isDeleting: boolean
  isUpdatingTemplate: boolean
  debugMode: boolean
}

export function DashboardCard({
  dashboard,
  onSyncDashboard,
  onClearDashboard,
  onDeleteDashboard,
  onUpdateTemplate,
  isSyncing,
  isCleaning,
  isDeleting,
  isUpdatingTemplate,
  debugMode,
}: DashboardCardProps) {
  const syncButtonText = () => {
    if (isSyncing) {
      return 'Re-sincronizando...'
    }
    if (isCleaning) {
      return 'Limpiando...'
    }
    if (isDeleting) {
      return 'Eliminando...'
    }
    return 'Resync'
  }

  const syncButtonVariant = () => {
    if (isDeleting) {
      return 'destructive'
    }
    return 'primary-outline'
  }

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
          {debugMode && (
            <Button
              onClick={() => onUpdateTemplate(dashboard.template.id)}
              variant="outline"
            >
              {isUpdatingTemplate ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="mr-2 h-4 w-4" />
              )}
              Actualizar Plantilla
            </Button>
          )}
          {debugMode && (
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
          )}
          <Button
            onClick={() => onSyncDashboard(dashboard.id)}
            disabled={isSyncing || isCleaning || isDeleting}
            variant={syncButtonVariant()}
          >
            <div className="flex items-center">
              {isSyncing || isCleaning || isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="mr-2 h-4 w-4" />
              )}
              {syncButtonText()}
            </div>
          </Button>

          <Button asChild variant="outline">
            <Link href={`/${dashboard.client.slug}`}>Ir a dashboard</Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:bg-transparent hover:text-foreground"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={() => onDeleteDashboard(dashboard.id)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash className="mr-2 h-4 w-4 text-red-600" />
                <span className="focus-within:text-red-600 focus:text-red-600">
                  Eliminar
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}
