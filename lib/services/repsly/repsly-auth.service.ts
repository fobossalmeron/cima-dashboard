import { ApiStatus } from '@/enums/api-status'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/types/api'

interface TokenData {
  access_token: string
  expires_in: number
  token_type: string
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

  private static isTokenExpiringSoon(tokenData: { expiresAt: Date | null }) {
    if (tokenData.expiresAt === null) {
      throw new Error('No se encontró el tiempo de expiración del token')
    }
    const expiryTime = new Date(tokenData.expiresAt).getTime()
    const currentTime = Date.now()
    return expiryTime - currentTime < RepslyAuthService.TOKEN_EXPIRY_THRESHOLD
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

    const { refreshToken, serviceClientId } = serviceToken

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

    const formData = new FormData()
    formData.append('client_id', serviceClientId)
    formData.append('grant_type', 'refresh_token')
    formData.append('scope', 'email offline_access openid profile')
    formData.append('refresh_token', refreshToken)

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
      throw new Error(
        `Error al actualizar el token: ${error.error || 'Unknown error'}`,
      )
    }

    const data = await response.json()

    await RepslyAuthService.saveRefreshToken(data)

    return {
      status: ApiStatus.SUCCESS,
      statusCode: 200,
      data,
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
        expiresAt,
      },
      create: {
        service: 'repsly',
        token: data.access_token,
        expiresAt,
      },
    })
  }

  static async makeAuthenticatedRequest<T>(
    url: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    try {
      const tokenData = await RepslyAuthService.getToken()

      if (RepslyAuthService.isTokenExpiringSoon(tokenData)) {
        await RepslyAuthService.refreshToken()
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${tokenData.token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.statusText}`)
      }

      const data = await response.json()
      return {
        status: ApiStatus.SUCCESS,
        data,
      }
    } catch (error) {
      return {
        status: ApiStatus.ERROR,
        error: error instanceof Error ? error.message : 'Error desconocido',
      }
    }
  }
}
