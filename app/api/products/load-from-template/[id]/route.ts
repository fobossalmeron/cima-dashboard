import { ProductTemplateProcessorService } from '@/lib/services'
import {
  LoadProductsFromTemplateErrorResponse,
  LoadProductsFromTemplateResponse,
  LoadProductsFromTemplateSuccessResponse,
} from '@/types/api'
import { NextResponse, NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<LoadProductsFromTemplateResponse>> {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json<LoadProductsFromTemplateErrorResponse>(
        { error: 'templateId is required', data: null },
        { status: 400 },
      )
    }

    const dashboard =
      await ProductTemplateProcessorService.createProductsFromTemplateId(id)

    return NextResponse.json<LoadProductsFromTemplateSuccessResponse>({
      data: dashboard,
      error: null,
    })
  } catch (error) {
    console.error(
      'Error al obtener dashboards:',
      error instanceof Error ? error.message : error,
    )
    return NextResponse.json<LoadProductsFromTemplateErrorResponse>(
      {
        error: error instanceof Error ? error.message : 'Error desconocido',
        data: null,
      },
      { status: 500 },
    )
  }
}
