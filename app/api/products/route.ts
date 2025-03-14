import { BrandsService } from '@/lib/services/db'
import {
  GetAllBrandsWithSubBrandsErrorResponse,
  GetAllBrandsWithSubBrandsResponse,
  GetAllBrandsWithSubBrandsSuccessResponse,
} from '@/types/api'
import { NextResponse } from 'next/server'

export async function GET(): Promise<
  NextResponse<GetAllBrandsWithSubBrandsResponse>
> {
  try {
    const data = await BrandsService.getAllWithSubBrands()

    return NextResponse.json<GetAllBrandsWithSubBrandsSuccessResponse>({
      data,
      error: null,
    })
  } catch (error) {
    console.error(
      'Error al obtener productos:',
      error instanceof Error ? error.message : error,
    )
    return NextResponse.json<GetAllBrandsWithSubBrandsErrorResponse>(
      {
        error: error instanceof Error ? error.message : 'Error desconocido',
        data: null,
      },
      { status: 500 },
    )
  }
}
