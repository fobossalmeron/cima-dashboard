import {
  FormTemplateResponse,
  ImportProductsResponse,
  RepslyProductsResponse,
} from '@/types/api'
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

  static async getProducts(
    page: number = 1,
    pageSize: number = 100,
  ): Promise<RepslyProductsResponse> {
    const response = await fetch(
      `/api/repsly/products?page=${page}&pageSize=${pageSize}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (!response.ok) {
      throw new Error('Error al obtener productos de Repsly')
    }

    return response.json() as Promise<RepslyProductsResponse>
  }

  static async importProducts(): Promise<ImportProductsResponse> {
    const response = await fetch('/api/repsly/products/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Error al importar productos de Repsly')
    }

    return response.json() as Promise<ImportProductsResponse>
  }
}
