import { FormTemplateResponse } from '@/types/api'
import { FormSearchResponse } from '@/types/dashboard'

export class RepslyApiService {
  static async searchForms(
    searchTerm: string = '',
  ): Promise<FormSearchResponse> {
    const response = await fetch('/api/repsly/forms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ searchTerm }),
    })

    if (!response.ok) {
      throw new Error('Error al buscar formularios')
    }

    return response.json() as Promise<FormSearchResponse>
  }

  static async getFormTemplate(id: string): Promise<FormTemplateResponse> {
    const response = await fetch(`/api/repsly/forms/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Error al obtener el formulario')
    }

    return response.json() as Promise<FormTemplateResponse>
  }
}
