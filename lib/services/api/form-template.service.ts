import { ClientData } from '@/types/api'
import { FormTemplate } from '@/types/api/form-template'

export class FormTemplateApiService {
  static async create(
    template: FormTemplate,
    client: ClientData,
    dashboardName: string,
  ) {
    console.log({ template, client, dashboardName })
    const response = await fetch('/api/form-templates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ template, clientId: client.id, dashboardName }),
    })

    if (!response.ok) {
      throw new Error('Error al crear el formulario')
    }

    return response.json()
  }

  static async getById(id: string) {
    const response = await fetch(`/api/form-templates/${id}`)

    if (!response.ok) {
      throw new Error('Error al obtener el formulario')
    }

    return response.json()
  }
}
