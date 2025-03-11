import { FormTemplateRequest } from '@/types/api/form-template'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { FormTemplateDbService } from '@/lib/services/db'

export async function POST(request: Request) {
  try {
    const { clientId, template, dashboardName } =
      (await request.json()) as FormTemplateRequest
    const client = await prisma.client.findUnique({
      where: {
        id: clientId,
      },
    })
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }
    const result = await FormTemplateDbService.createFromTemplate(
      template,
      clientId,
      dashboardName,
    )
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating form template:', error)
    return NextResponse.json(
      { error: 'Error creating form template' },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const formTemplates = await FormTemplateDbService.getAll()
    return NextResponse.json(formTemplates)
  } catch (error) {
    console.error('Error getting form templates:', error)
    return NextResponse.json(
      { error: 'Error getting form templates' },
      { status: 500 },
    )
  }
}
