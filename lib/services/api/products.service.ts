import { LoadProductsFromTemplateResponse } from '@/types/api'

export class ProductsApiService {
  static async loadFromTemplate(
    templateId: string,
  ): Promise<LoadProductsFromTemplateResponse> {
    const response = await fetch(
      `/api/products/load-from-template/${templateId}`,
    )

    if (!response.ok) {
      throw new Error(`Error al obtener los productos: ${response.statusText}`)
    }

    return response.json() as Promise<LoadProductsFromTemplateResponse>
  }
}
