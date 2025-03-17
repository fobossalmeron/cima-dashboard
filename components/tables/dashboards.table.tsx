'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCcw } from 'lucide-react'
import Link from 'next/link'
import { DashboardWithClientAndTemplate } from '@/types/api'

interface DashboardsTableProps {
  dashboards: DashboardWithClientAndTemplate[]
  onSyncDashboard: (dashboardId: string, templateId: string) => void
  isSyncing: boolean
}

export function DashboardsTable({
  dashboards,
  onSyncDashboard,
  isSyncing,
}: DashboardsTableProps) {
  return (
    <div className="grid gap-4">
      {dashboards.map((dashboard) => (
        <Card key={dashboard.id}>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium">{dashboard.client.name}</h3>
              <p className="text-sm text-gray-600">
                Formulario: {dashboard.template.name}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() =>
                  onSyncDashboard(dashboard.id, dashboard.templateId)
                }
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
                <Link href={`/${dashboard.client.id}/${dashboard.id}`}>
                  Ir a dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
