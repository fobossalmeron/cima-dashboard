import { NextRequest, NextResponse } from 'next/server'
import { FormTemplateService } from '@/lib/services'
import { FormTemplateController } from '@/lib/controllers/form-template/form-template.controller'

export async function POST(request: NextRequest) {
  return FormTemplateController.create(request)
}

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
