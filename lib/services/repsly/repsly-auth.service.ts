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

  static async refreshToken(data: TokenData) {
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
        await RepslyAuthService.refreshToken({
          access_token: tokenData.token,
          expires_in: 3600, // 1 hora
          token_type: 'Bearer',
        })
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
