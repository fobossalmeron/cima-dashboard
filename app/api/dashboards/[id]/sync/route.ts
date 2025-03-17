import { NextResponse } from 'next/server'
import { SyncRequest, SyncResponse } from '@/types/api'
import { DashboardSyncService } from '@/lib/services/db/dashboard-sync.service'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<SyncResponse> {
  try {
    const { id } = await params

    const { formData } = (await request.json()) as SyncRequest
    const submissions = await DashboardSyncService.sync(id, formData)

    return NextResponse.json({
      data: submissions,
      error: null,
    })
  } catch (error) {
    console.error('Error al sincronizar el dashboard:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Error al sincronizar el dashboard',
        data: null,
      },
      { status: 500 },
    )
  }
}
