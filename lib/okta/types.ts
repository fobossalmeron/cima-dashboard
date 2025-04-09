export interface OktaKeys {
  keys: Array<{
    kty: string
    alg: string
    kid: string
    use: string
    e: string
    n: string
  }>
}

export interface CompanyContext {
  Id: string
  Name: string
  Impersonated: boolean
}

export interface TokenResponse {
  access_token: string
  id_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  scope: string
}

export interface OktaConfig {
  clientId: string
  issuer: string
  redirectUri: string
  scopes: string[]
  tokenUrl: string
  pkce: boolean
  cookies: {
    secure: boolean
    sameSite: 'lax' | 'strict' | 'none'
  }
  devMode: boolean
}
