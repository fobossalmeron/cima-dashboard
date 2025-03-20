import { FiltersController } from '@/lib/controllers/dashboard/filters.controller'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const resolvedParams = await params
  try {
    const filters = await FiltersController.getFilters(request, resolvedParams)
    return NextResponse.json(filters)
  } catch (error) {
    console.error(
      `Error fetching filters for dashboard ${resolvedParams.id}:`,
      error,
    )
    return NextResponse.json(
      { error: 'Error fetching filters' },
      { status: 500 },
    )
  }
}
