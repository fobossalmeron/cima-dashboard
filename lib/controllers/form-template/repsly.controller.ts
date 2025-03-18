import { NextRequest, NextResponse } from 'next/server'
import { RepslyApiService } from '@/lib/services/api'
import { ApiStatus } from '@/enums/api-status'
import { FormSearchResponse } from '@/types'

export class RepslyFormTemplatesController {
  static async search(
    request: NextRequest,
  ): Promise<NextResponse<FormSearchResponse>> {
    const { search } = await request.json()
    try {
      const response = await RepslyApiService.searchForms(search)
      return NextResponse.json({
        status: ApiStatus.SUCCESS,
        data: response,
      })
    } catch (error) {
      console.error('Error al buscar formularios:', error)
      return NextResponse.json(
        {
          status: ApiStatus.ERROR,
          error: 'Error al buscar formularios',
        },
        { status: 404 },
      )
    }
  }

  static async getFromId(_: NextRequest, params?: { id: string }) {
    try {
      const id = params?.id

      if (!id) {
        return NextResponse.json(
          { error: 'Se requiere el ID del formulario' },
          { status: 400 },
        )
      }

      const template = await RepslyApiService.getFormTemplate(id)
      return NextResponse.json({ data: template })
    } catch (error) {
      console.error('Error al obtener el template:', error)
      return NextResponse.json(
        { error: 'Error al obtener el template' },
        { status: 500 },
      )
    }
  }
}
