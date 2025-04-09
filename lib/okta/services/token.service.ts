import { OktaKeys, TokenResponse } from '../types'
import {
  generateCodeChallenge,
  generateCodeVerifier,
} from '../utils/pkce.utils'

export class TokenService {
  constructor(
    private readonly issuer: string,
    private readonly clientId: string,
    private readonly redirectUri: string,
    private readonly scopes: string[],
  ) {}

  async getTokensWithCode(
    code: string,
    codeVerifier: string,
  ): Promise<TokenResponse> {
    const tokenEndpoint = `${this.issuer}/v1/token`
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.redirectUri,
      client_id: this.clientId,
      code_verifier: codeVerifier,
    })

    const tokenResponse = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenParams.toString(),
    })

    if (!tokenResponse.ok) {
      throw new Error(`Token request failed: ${tokenResponse.statusText}`)
    }

    return await tokenResponse.json()
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const tokenEndpoint = `${this.issuer}/v1/token`
    const tokenParams = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: this.clientId,
      scope: this.scopes.join(' '),
    })

    const tokenResponse = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenParams.toString(),
    })

    if (!tokenResponse.ok) {
      throw new Error(`Token refresh failed: ${tokenResponse.statusText}`)
    }

    return await tokenResponse.json()
  }

  async getOktaKeys(): Promise<OktaKeys> {
    const keysEndpoint = `${this.issuer}/v1/keys`
    const response = await fetch(keysEndpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get Okta keys: ${response.statusText}`)
    }

    return await response.json()
  }

  generateAuthorizationUrl(
    sessionToken: string,
    state: string,
    nonce: string,
  ): { url: string; codeVerifier: string } {
    const codeVerifier = generateCodeVerifier()
    const codeChallenge = generateCodeChallenge(codeVerifier)

    const authorizeParams = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: this.scopes.join(' '),
      state,
      nonce,
      sessionToken,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    })

    const url = `${this.issuer}/v1/authorize?${authorizeParams.toString()}`
    return { url, codeVerifier }
  }
}
