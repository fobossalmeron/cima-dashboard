import { OktaAuth } from '@okta/okta-auth-js'
import { Log } from '@/lib/utils/log'
import { OktaConfig, TokenResponse } from './types'
import { AuthService } from './services/auth.service'
import { createHttpClient } from './utils/http.utils'

/**
 * @class OktaClient
 * @description A singleton class for interacting with Okta
 */
export class OktaClient {
  private static instances = new Map<string, OktaClient>()
  private authClient: OktaAuth
  private authService: AuthService

  /**
   * @param clientId - The client ID of the Okta application
   */
  constructor(private readonly clientId: string) {
    try {
      const config: OktaConfig = {
        clientId,
        issuer: process.env.OKTA_ISSUER as string,
        redirectUri: process.env.OKTA_REDIRECT_URI as string,
        scopes: ['offline_access', 'email', 'profile', 'openid'],
        tokenUrl: process.env.OKTA_TOKEN_URL as string,
        pkce: true,
        cookies: {
          secure: false,
          sameSite: 'lax',
        },
        devMode: true,
      }

      this.authClient = new OktaAuth({
        ...config,
        httpRequestClient: createHttpClient(),
        storageManager: {
          token: {
            storageTypes: ['memory'],
          },
        },
      })

      if (!this.authClient) {
        throw new Error('Failed to initialize Okta client')
      }

      this.authService = new AuthService(this.authClient)
    } catch (error) {
      Log.error('Error initializing Okta client', { error })
      throw error
    }
  }

  /**
   * @description Get an instance of the Okta client
   * @param clientId - The client ID of the Okta application
   * @returns An instance of the Okta client
   */
  public static getInstance(clientId: string): OktaClient {
    if (!this.instances.has(clientId)) {
      this.instances.set(clientId, new OktaClient(clientId))
    }
    return this.instances.get(clientId)!
  }

  /**
   * @description Get the OktaAuth instance
   * @returns The OktaAuth instance
   */
  public getAuthClient(): OktaAuth {
    return this.authClient
  }

  /**
   * @description Sign in with credentials
   * @param username - The username of the user
   * @param password - The password of the user
   * @returns The session token
   */
  public async signInWithCredentials(
    username: string,
    password: string,
  ): Promise<{ sessionToken: string }> {
    return this.authService.signInWithCredentials(username, password)
  }

  /**
   * @description Get the tokens with the session token
   * @param sessionToken - The session token
   * @param state - The state
   * @param nonce - The nonce
   * @returns The tokens
   */
  public async getTokensWithSessionToken(
    sessionToken: string,
    state: string,
    nonce: string,
  ): Promise<TokenResponse> {
    return this.authService.getTokensWithSessionToken(
      sessionToken,
      state,
      nonce,
    )
  }

  /**
   * @description Refresh the token and set the session
   * @param refreshToken - The refresh token
   * @returns The tokens
   */
  public async refreshTokenAndSetSession(
    refreshToken: string,
  ): Promise<TokenResponse> {
    return this.authService.refreshTokenAndSetSession(refreshToken)
  }
}
