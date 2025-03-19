import { NextRequest, NextResponse } from 'next/server'
import { FormTemplateService } from '@/lib/services'
import { FormTemplateController } from '@/lib/controllers/form-template/form-template.controller'

// Configuración de CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Manejo de OPTIONS para CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(request: NextRequest) {
  try {
    const response = await FormTemplateController.create(request)
    // Agregar headers de CORS a la respuesta
    for (const [key, value] of Object.entries(corsHeaders)) {
      response.headers.set(key, value)
    }
    return response
  } catch (error) {
    console.error('Error creating form template:', error)
    return NextResponse.json(
      { error: 'Error creating form template' },
      { status: 500, headers: corsHeaders },
    )
  }
}

export async function GET() {
  try {
    const formTemplates = await FormTemplateService.getAll()
    return NextResponse.json(formTemplates, { headers: corsHeaders })
  } catch (error) {
    console.error('Error getting form templates:', error)
    return NextResponse.json(
      { error: 'Error getting form templates' },
      { status: 500, headers: corsHeaders },
    )
  }
}

// Definir explícitamente los métodos HTTP permitidos
export const dynamic = 'force-dynamic'
export const runtime = 'edge'
export const revalidate = 0
