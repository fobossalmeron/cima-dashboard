import { FormTemplateController } from '@/lib/controllers/form-template/form-template.controller'
import { FormTemplateService } from '@/lib/services'
import { NextRequest, NextResponse } from 'next/server'
import { runtime } from '@/lib/config/runtime'

// Definir explícitamente los métodos HTTP permitidos
export const dynamic = 'force-dynamic'
export { runtime }
export const revalidate = 0

export async function GET() {
  try {
    const formTemplates = await FormTemplateService.getAll()
    return NextResponse.json(formTemplates)
  } catch (error) {
    console.error('Error getting form templates:', error)
    return NextResponse.json(
      { error: 'Error getting form templates' },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  return FormTemplateController.create(req)
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
