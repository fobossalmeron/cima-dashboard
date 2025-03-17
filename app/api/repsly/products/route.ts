import { NextResponse } from 'next/server'
import { RepslyService } from '@/lib/services/repsly/repsly.service'

export async function POST() {
  try {
    const response = await RepslyService.importProducts()
    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 },
    )
  }
}
