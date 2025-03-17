import { ApiStatus } from '@/enums/api-status'
import { RepslyApiService } from '@/lib/services/api'
import { ServiceTokenService } from './service-token.service'

export class AuthService {
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

    const serviceToken = await ServiceTokenService.findByService('repsly')

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

    const data = await RepslyApiService.refreshToken({
      client_id: serviceClientId,
      refresh_token: refreshToken,
    })

    return {
      status: ApiStatus.SUCCESS,
      statusCode: 200,
      data,
    }
  }
}
