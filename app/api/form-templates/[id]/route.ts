import { ApiStatus } from '@/enums/api-status'
import { FormTemplateService } from '@/lib/services'
import { RepslyApiService } from '@/lib/services/api'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const formTemplate = await FormTemplateService.getById(id)

    if (!formTemplate) {
      return NextResponse.json(
        { error: 'Formulario no encontrado' },
        { status: 404 },
      )
    }

    return NextResponse.json(formTemplate)
  } catch (error) {
    console.error('Error al obtener el formulario:', error)
    return NextResponse.json(
      { error: 'Error al obtener el formulario' },
      { status: 500 },
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const template = await RepslyApiService.getFormTemplate(id)
    const { questions } = await FormTemplateService.updateFromTemplateQuestions(
      {
        template,
      },
    )

    return NextResponse.json({
      status: ApiStatus.SUCCESS,
      data: {
        questions,
      },
    })
  } catch (error) {
    console.error('Error al actualizar el formulario:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el formulario' },
      { status: 500 },
    )
  }
}
