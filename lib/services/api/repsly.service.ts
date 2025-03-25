import {
  FormTemplate,
  FormTemplateSearchResponse,
  ImportProductsResponse,
  RefreshTokenApiRequest,
  RefreshTokenApiResponse,
  RepslyProductsResponse,
  SyncDashboardResponse,
} from '@/types/api'
import {
  FormSearchData,
  FormSearchRequest,
  SearchOperator,
  SearchType,
} from '@/types/dashboard'
import { ServiceToken } from '@prisma/client'
import { ServiceTokenService } from '../db'
import { RepslyAuthService } from '../repsly/repsly-auth.service'
import { DateRange } from '@/types/services'

export class RepslyApiService {
  private static getBaseUrl() {
    // En el servidor, usar la URL completa
    if (typeof window === 'undefined') {
      return `${process.env.NEXT_PUBLIC_API_URL}`
    }
    // En el cliente, usar rutas relativas
    return ''
  }

  static async makeAuthenticatedRequest<T>(
    url: string,
    options: RequestInit & {
      headers?: HeadersInit
    },
  ): Promise<T> {
    const tokenResponse = await fetch(`${this.getBaseUrl()}/api/repsly/token`)

    if (!tokenResponse.ok) {
      throw new Error('No se encontró el token de Repsly')
    }

    const data = await tokenResponse.json()

    if (!data) {
      throw new Error('No se encontró el token de Repsly')
    }

    let tokenData = data

    // Verificar si el token está próximo a expirar (menos de 5 minutos)
    const isTokenExpiringSoon =
      tokenData.expiresAt && tokenData.expiresAt.getTime() - Date.now() < 300000 // 5 minutos en milisegundos

    if (isTokenExpiringSoon) {
      console.log('Token próximo a expirar, refrescando...')
      const refreshTokenData: RefreshTokenApiRequest = {
        client_id: process.env.REPSLY_CLIENT_ID || '',
        refresh_token: tokenData.refreshToken || '',
      }
      await this.refreshToken(refreshTokenData)
      const newTokenData = await ServiceTokenService.findByService('repsly')
      if (!newTokenData) {
        throw new Error('No se pudo obtener el nuevo token de Repsly')
      }
      tokenData = newTokenData
    }

    try {
      const response = await this.makeRequest(url, options, tokenData)
      return await this.handleResponse<T>(response)
    } catch (error) {
      if (error instanceof Error && error.message === 'TOKEN_INVALID') {
        console.log('Token inválido, intentando refrescar...')
        // Obtener datos necesarios para refrescar el token
        const refreshTokenData: RefreshTokenApiRequest = {
          client_id: process.env.REPSLY_CLIENT_ID || '',
          refresh_token: tokenData.refreshToken || '',
        }

        // Refrescar el token
        await this.refreshToken(refreshTokenData)

        // Obtener el nuevo token
        const newTokenData = await ServiceTokenService.findByService('repsly')
        if (!newTokenData) {
          throw new Error('No se pudo obtener el nuevo token de Repsly')
        }

        // Reintentar la petición con el nuevo token
        const response = await this.makeRequest(url, options, newTokenData)
        return await this.handleResponse<T>(response)
      }
      throw error
    }
  }

  private static async makeRequest(
    url: string,
    options: RequestInit & {
      headers?: HeadersInit
    },
    tokenData: ServiceToken,
  ): Promise<Response> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenData.token}`,
      Fingerprint: tokenData.fingerprint || '',
      ...options.headers,
    }

    const response = await fetch(`${this.getBaseUrl()}${url}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('TOKEN_INVALID')
      }
      throw new Error(`Error en la petición: ${response.statusText}`)
    }

    return response
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type')

    if (contentType?.includes('application/json')) {
      return response.json()
    }

    if (
      contentType?.includes('text/csv') ||
      contentType?.includes('text/plain')
    ) {
      const buffer = await response.arrayBuffer()
      const text = new TextDecoder('utf-8').decode(buffer)
      return text as unknown as T
    }

    throw new Error(`Tipo de contenido no soportado: ${contentType}`)
  }

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
    return this.makeAuthenticatedRequest<RepslyProductsResponse>(
      `/api/repsly/products?page=${page}&pageSize=${pageSize}`,
      {
        method: 'GET',
      },
    )
  }

  static async importProducts(): Promise<ImportProductsResponse> {
    return this.makeAuthenticatedRequest<ImportProductsResponse>(
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
    return this.makeAuthenticatedRequest<SyncDashboardResponse>(
      `/api/repsly/forms/${id}/export?${params.toString()}`,
      {
        method: 'GET',
      },
    )
  }

  static async refreshToken(
    data: RefreshTokenApiRequest,
  ): Promise<RefreshTokenApiResponse> {
    const refreshTokenUrl = process.env.REPSLY_REFRESH_TOKEN_URL ?? ''
    const { client_id, refresh_token } = data

    const formData = new FormData()
    formData.append('client_id', client_id)
    formData.append('grant_type', 'refresh_token')
    formData.append('scope', 'email offline_access openid profile')
    formData.append('refresh_token', refresh_token)

    console.log('Refreshing token with data:', formData)

    const response = await fetch(refreshTokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Error from repsly:', error)
      throw new Error(`${JSON.stringify(error, null, 2)}`)
    }

    const tokenResponse = (await response.json()) as RefreshTokenApiResponse

    // Calcular la fecha de expiración
    const expiresAt = new Date()
    expiresAt.setSeconds(expiresAt.getSeconds() + tokenResponse.expires_in)

    // Actualizar el token en la base de datos
    await ServiceTokenService.update('repsly', {
      token: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      expiresIn: tokenResponse.expires_in,
      expiresAt,
    })

    return tokenResponse
  }
}
