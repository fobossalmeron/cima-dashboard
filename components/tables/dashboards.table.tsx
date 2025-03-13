'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCcw } from 'lucide-react'
import Link from 'next/link'
import { DashboardWithClientAndTemplate } from '@/types/api'

interface DashboardsTableProps {
  dashboards: DashboardWithClientAndTemplate[]
  onLoadProducts: (templateId: string) => void
}

export function DashboardsTable({
  dashboards,
  onLoadProducts,
}: DashboardsTableProps) {
  return (
    <div className="grid gap-4">
      {dashboards.map((dashboard) => (
        <Card key={dashboard.id}>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium">{dashboard.name}</h3>
              <p className="text-sm text-gray-600">
                Formulario: {dashboard.template.name}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => onLoadProducts(dashboard.template.id)}
                variant="primary-outline"
              >
                Cargar productos
              </Button>
              <Button asChild variant="primary-outline">
                <div>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  <Link href={`/${dashboard.id}`}>Resync</Link>
                </div>
              </Button>
              <Button asChild variant="outline">
                <Link href={`/${dashboard.id}`}>Ir a dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
