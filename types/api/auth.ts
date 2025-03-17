import { ApiStatus } from '@/enums/api-status'

export interface RefreshTokenApiRequest {
  client_id: string
  refresh_token: string
}

export interface RefreshTokenApiResponse {
  access_token: string
  expires_in: number
  id_token: string
  refresh_token: string
  scope: string
  token_type: string
}

export interface RefreshTokenSuccessResponse {
  data: RefreshTokenApiResponse
  error: null
  status: ApiStatus.SUCCESS
}

export interface RefreshTokenErrorResponse {
  error: string
  data: null
  status: ApiStatus.ERROR
  statusCode: number
}

export type RefreshTokenResponse =
  | RefreshTokenSuccessResponse
  | RefreshTokenErrorResponse
