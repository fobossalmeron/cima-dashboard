import { ApiStatus } from '@/enums/api-status'
import { withTransaction } from '@/prisma/prisma'
import { RepslyApiService } from '@/lib/services/api'
import {
  ClientsService,
  FormTemplateService,
  ProductTemplateProcessorService,
} from '@/lib/services'
import { FormTemplateRequest, FormTemplateResponse } from '@/types/api'
import { NextRequest, NextResponse } from 'next/server'

export class FormTemplateController {
  static async create(
    request: NextRequest,
  ): Promise<NextResponse<FormTemplateResponse>> {
    const { clientName, clientSlug, templateId } =
      (await request.json()) as FormTemplateRequest
    const clientData = { name: clientName, slug: clientSlug }

    try {
      // Usar withTransaction para manejar reintentos automáticamente
      const result = await withTransaction(async (tx) => {
        const { client } = await ClientsService.create(clientData, tx)
        const template = await RepslyApiService.getFormTemplate(templateId)
        const { dashboard, template: formTemplate } =
          await FormTemplateService.createFromTemplate(
            {
              clientId: client.id,
              template,
            },
            tx,
          )
        await ProductTemplateProcessorService.processTemplate(formTemplate, tx)
        return {
          client,
          dashboard,
          template: formTemplate,
        }
      })

      return NextResponse.json({
        status: ApiStatus.SUCCESS,
        data: result,
      })
    } catch (error) {
      console.error('Error creating form template:', error)
      return NextResponse.json(
        {
          status: ApiStatus.ERROR,
          error: 'Error creating form template',
        },
        { status: 500 },
      )
    }
  }
}
