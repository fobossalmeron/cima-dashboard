import { FormTemplateDbService } from '@/lib/services/db/form-template.service'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const formTemplate = await FormTemplateDbService.getById(id)

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
