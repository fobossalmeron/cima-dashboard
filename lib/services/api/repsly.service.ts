import {
  FormTemplate,
  FormTemplateSearchResponse,
  ImportProductsResponse,
  RepslyProductsResponse,
  SyncDashboardResponse,
} from '@/types/api'
import {
  FormSearchData,
  FormSearchRequest,
  SearchOperator,
  SearchType,
} from '@/types/dashboard'
import { RepslyAuthService } from '../repsly/repsly-auth.service'
import { DateRange } from '@/types/services'
import { InvalidTokenException } from '@/errors/invalid-token'
import { ApiStatusCode } from '@/enums/api-status'

export class RepslyApiService {
  static async searchForms(searchTerm: string = ''): Promise<FormSearchData> {
    const REPSLY_API_URL = process.env.REPSLY_API_URL ?? ''
    const { token, fingerprint } = await RepslyAuthService.getToken()

    const requestBody: FormSearchRequest = {
      Skip: 0,
      Limit: 10,
      Elements: [
        {
          Operator: SearchOperator.Is,
          Type: SearchType.IsActive,
          Value: true,
        },
        ...(searchTerm.length > 0
          ? [
              {
                Operator: SearchOperator.Contains,
                Type: SearchType.Search,
                Value: searchTerm,
              },
            ]
          : []),
      ],
      SortField: 'LastUpdatedUtc',
      SortDescending: true,
    }

    const response = await fetch(`${REPSLY_API_URL}/Template/List`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Fingerprint: fingerprint ?? '',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      throw new Error(`Error al buscar formularios: ${response.statusText}`)
    }

    const data = await response.json()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = (data as any[]).map(
      (item): FormTemplateSearchResponse => ({
        id: item.Id,
        name: item.Name,
        description: item.Description,
        active: item.Active,
        sortOrder: item.SortOrder,
        version: item.Version,
        createdAt: item.CreatedAt,
        updatedAt: item.UpdatedAt,
        createdBy: item.CreatedBy,
        updatedBy: item.UpdatedBy,
      }),
    )
    const total = items.length

    return {
      items,
      total,
    }
  }

  static async getFormTemplate(id: string): Promise<FormTemplate> {
    const { token, fingerprint } = await RepslyAuthService.getToken()
    const REPSLY_API_URL = process.env.REPSLY_API_URL

    const response = await fetch(`${REPSLY_API_URL}/Template/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Fingerprint: fingerprint ?? '',
      },
    })

    if (!response.ok) {
      throw new Error(`Error al obtener el formulario: ${response.statusText}`)
    }

    const data = await response.json()

    return data as FormTemplate
  }

  static async getProducts(
    page: number = 1,
    pageSize: number = 100,
  ): Promise<RepslyProductsResponse> {
    return RepslyAuthService.makeAuthenticatedRequest<RepslyProductsResponse>(
      `/api/repsly/products?page=${page}&pageSize=${pageSize}`,
      {
        method: 'GET',
      },
    )
  }

  static async importProducts(): Promise<ImportProductsResponse> {
    return RepslyAuthService.makeAuthenticatedRequest<ImportProductsResponse>(
      '/api/repsly/products/import',
      {
        method: 'POST',
      },
    )
  }

  /**
   * Export a form from Repsly in CSV format
   * @param id - The ID of the form to export
   * @returns The CSV text of the form
   */
  static async exportForm(
    id: string,
    start?: string | null,
    end?: string | null,
  ): Promise<string> {
    const exportUrl = process.env.REPSLY_EXPORT_URL ?? ''
    const { token, fingerprint } = await RepslyAuthService.getToken()

    // If end is not provided, use the current date
    const currentDate = end ? new Date(end) : new Date()
    // If start is not provided, use the date 120 days ago
    const dateBegin = start
      ? new Date(start)
      : new Date(new Date().setDate(currentDate.getDate() - 120))

    const headers = {
      Accept: 'text/plain,text/csv',
      'Accept-Encoding': 'identity',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      Fingerprint: fingerprint || '',
    }
    const body = {
      DateBegin: dateBegin.toISOString().split('T')[0],
      DateEnd: currentDate.toISOString().split('T')[0],
      ExportType: 'csv',
      ShowClientExtraInfo: true,
      UniDocZagRowID: id,
    }

    const response = await fetch(exportUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    const contentType = response.headers.get('content-type')
    if (!contentType?.includes('text/csv')) {
      throw new InvalidTokenException(
        'Error al importar las respuestas del formulario',
        ApiStatusCode.UNAUTHORIZED,
      )
    }
    // Obtener el buffer completo de la respuesta
    const buffer = await response.arrayBuffer()
    // Convertir el buffer a texto usando UTF-8
    return new TextDecoder('utf-8').decode(buffer)
  }

  static async syncDashboard(
    id: string,
    dateRange: DateRange | null,
  ): Promise<SyncDashboardResponse> {
    const params = new URLSearchParams()
    if (dateRange) {
      params.set('start', dateRange.startDate.toISOString())
      params.set('end', dateRange.endDate.toISOString())
    }
    return RepslyAuthService.makeAuthenticatedRequest<SyncDashboardResponse>(
      `/api/repsly/forms/${id}/export?${params.toString()}`,
      {
        method: 'GET',
      },
    )
  }
}
