import { ApiStatus } from '@/enums/api-status'
import { prisma } from '@/lib/prisma'
import { ServiceToken } from '@prisma/client'
import { SlackService } from '@/lib/services'
import { InvalidTokenException } from '@/errors/invalid-token'

interface TokenData {
  access_token: string
  expires_in: number
  token_type: string
  refresh_token: string
  id_token: string
  scope: string
}

export class RepslyAuthService {
  private static readonly TOKEN_EXPIRY_THRESHOLD = 5 * 60 * 1000 // 5 minutos en milisegundos

  static async getToken() {
    const tokenData = await prisma.serviceToken.findFirst({
      where: {
        service: 'repsly',
      },
    })

    if (!tokenData) {
      throw new Error('No se encontró el token de autenticación')
    }

    return tokenData
  }

  static isTokenExpiringSoon(tokenData: { expiresAt: Date | null }) {
    if (tokenData.expiresAt === null) {
      throw new Error('No se encontró el tiempo de expiración del token')
    }
    const expiryTime = new Date(tokenData.expiresAt).getTime()
    const currentTime = Date.now()
    return expiryTime - currentTime < RepslyAuthService.TOKEN_EXPIRY_THRESHOLD
  }

  static isTokenExpired(tokenData: { expiresAt: Date | null }) {
    if (tokenData.expiresAt === null) {
      throw new Error('No se encontró el tiempo de expiración del token')
    }
    const expiryTime = new Date(tokenData.expiresAt).getTime()
    const currentTime = Date.now()
    return expiryTime < currentTime
  }

  static async refreshToken() {
    const refreshTokenUrl = process.env.REPSLY_REFRESH_TOKEN_URL
    if (!refreshTokenUrl) {
      return {
        status: ApiStatus.ERROR,
        statusCode: 500,
        error: 'Missing environment variables',
        data: null,
      }
    }

    const serviceToken = await RepslyAuthService.getToken()

    if (!serviceToken) {
      return {
        status: ApiStatus.ERROR,
        statusCode: 404,
        error: 'Service token not found',
        data: null,
      }
    }

    const { refreshToken, serviceClientId, fingerprint } = serviceToken

    if (!serviceClientId) {
      return {
        status: ApiStatus.ERROR,
        statusCode: 404,
        error: 'Service client ID not found',
        data: null,
      }
    }

    if (!refreshToken) {
      return {
        status: ApiStatus.ERROR,
        statusCode: 404,
        error: 'Refresh token not found',
        data: null,
      }
    }

    const params = new URLSearchParams()
    params.append('client_id', serviceClientId)
    params.append('grant_type', 'refresh_token')
    params.append('scope', 'email offline_access openid profile')
    params.append('refresh_token', refreshToken)

    const requestInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'es-ES,es;q=0.9',
        Connection: 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        Fingerprint: fingerprint || '',
      },
      body: params.toString(),
    }

    console.log('refreshTokenUrl', refreshTokenUrl)
    console.log('requestInit', requestInit)

    const response = await fetch(refreshTokenUrl, requestInit)

    if (!response.ok) {
      const error = await response.json()
      console.error('Error refreshing token:', error)
      SlackService.sendMessage(
        `Error al actualizar el token: ${error.error || 'Unknown error'}`,
      )
      throw new Error(
        `Error al actualizar el token: ${error.error || 'Unknown error'}`,
      )
    }

    const data = await response.json()

    await RepslyAuthService.saveRefreshToken(data)

    // Ordenar las claves del objeto de respuesta
    const orderedData = {
      token_type: data.token_type,
      expires_in: data.expires_in,
      access_token: data.access_token,
      scope: data.scope,
      refresh_token: data.refresh_token,
      id_token: data.id_token,
    }

    SlackService.sendMessage(
      `Token actualizado:\n ${JSON.stringify(orderedData)}`,
    )

    return {
      status: ApiStatus.SUCCESS,
      statusCode: 200,
      data: orderedData,
    }
  }

  static async saveRefreshToken(data: TokenData) {
    const expiresAt = new Date(Date.now() + data.expires_in * 1000)

    await prisma.serviceToken.upsert({
      where: {
        service: 'repsly',
      },
      update: {
        token: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
        expiresAt,
        fingerprint: process.env.REPSLY_FINGERPRINT || undefined,
        serviceClientId: process.env.REPSLY_CLIENT_ID || undefined,
      },
      create: {
        service: 'repsly',
        token: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
        expiresAt,
        fingerprint: process.env.REPSLY_FINGERPRINT || undefined,
        serviceClientId: process.env.REPSLY_CLIENT_ID || undefined,
      },
    })
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

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${url}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new InvalidTokenException(
          'Los accesos de Repsly han caducado',
          response.status,
        )
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

  static async makeAuthenticatedRequest<T>(
    url: string,
    options: RequestInit = {},
  ): Promise<T> {
    const tokenData = await RepslyAuthService.getToken()

    const response = await this.makeRequest(url, options, tokenData)
    return await this.handleResponse<T>(response)
  }
}
