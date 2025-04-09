import { OktaAuth } from '@okta/okta-auth-js'
import { TokenResponse } from '../types'
import { TokenService } from './token.service'
import { CompanyService } from './company.service'

export class AuthService {
  private tokenService: TokenService
  private companyService: CompanyService

  constructor(private readonly authClient: OktaAuth) {
    this.tokenService = new TokenService(
      authClient.options.issuer as string,
      authClient.options.clientId as string,
      authClient.options.redirectUri as string,
      authClient.options.scopes as string[],
    )
    this.companyService = new CompanyService()
  }

  async signInWithCredentials(
    username: string,
    password: string,
  ): Promise<{ sessionToken: string }> {
    const signInResponse = await this.authClient.signInWithCredentials({
      username,
      password,
    })

    if (!signInResponse.sessionToken) {
      throw new Error('Session token is undefined')
    }

    return {
      sessionToken: signInResponse.sessionToken,
    }
  }

  async getTokensWithSessionToken(
    sessionToken: string,
    state: string,
    nonce: string,
  ): Promise<TokenResponse> {
    // 1. Generar URL de autorización y obtener código
    const { url, codeVerifier } = this.tokenService.generateAuthorizationUrl(
      sessionToken,
      state,
      nonce,
    )

    const authorizeResponse = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      redirect: 'manual',
    })

    const location = authorizeResponse.headers.get('location')
    if (!location) {
      throw new Error('No redirect location found in response')
    }

    // 2. Extraer el código de autorización
    const redirectUrl = new URL(location)
    const code = redirectUrl.searchParams.get('code')
    if (!code) {
      throw new Error('No authorization code found in response')
    }

    // 3. Intercambiar el código por tokens
    const tokens = await this.tokenService.getTokensWithCode(code, codeVerifier)

    // 4. Obtener el contexto de la compañía
    const companies = await this.companyService.getCompanyContext(
      tokens.access_token,
    )

    if (companies && companies.length > 0) {
      // 5. Establecer la sesión de la compañía
      const fingerprint = process.env.REPSLY_FINGERPRINT || ''
      await this.companyService.setCompanySession(
        tokens.access_token,
        companies[0].Id,
        fingerprint,
      )
    }

    return tokens
  }

  async refreshTokenAndSetSession(
    refreshToken: string,
  ): Promise<TokenResponse> {
    // 1. Refrescar el token
    const tokens = await this.tokenService.refreshToken(refreshToken)

    // 2. Obtener el contexto de la compañía
    const companies = await this.companyService.getCompanyContext(
      tokens.access_token,
    )

    if (companies && companies.length > 0) {
      // 3. Establecer la sesión de la compañía
      const fingerprint = process.env.REPSLY_FINGERPRINT || ''
      await this.companyService.setCompanySession(
        tokens.access_token,
        companies[0].Id,
        fingerprint,
      )
    }

    return tokens
  }
}
