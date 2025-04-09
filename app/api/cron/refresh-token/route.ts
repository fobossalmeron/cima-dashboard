import { NextRequest, NextResponse } from 'next/server'
import { Log } from '@/lib/utils/log'
import { OktaClient } from '@/lib/okta'
import { SlackService } from '@/lib/services'
import { ServiceTokenService } from '@/lib/services/db'
import { randomBytes } from 'crypto'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 1. Obtener el token actual
    const serviceToken = await ServiceTokenService.findByService('repsly')
    if (!serviceToken) {
      throw new Error('No service token found')
    }

    const oktaClient = OktaClient.getInstance(
      serviceToken.serviceClientId as string,
    )

    try {
      // 2. Intentar refresh token
      if (serviceToken.refreshToken) {
        const tokens = await oktaClient.refreshTokenAndSetSession(
          serviceToken.refreshToken,
        )

        // 3. Guardar los nuevos tokens
        await ServiceTokenService.update('repsly', {
          token: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiresIn: tokens.expires_in,
          expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        })

        Log.info('Token refreshed successfully')
        return NextResponse.json({ status: 'Token refreshed successfully' })
      }

      throw new Error('No refresh token available')
    } catch (refreshError) {
      Log.error('Refresh token failed, trying login', { error: refreshError })

      // 4. Si falla el refresh, intentar login
      try {
        const { sessionToken } = await oktaClient.signInWithCredentials(
          process.env.REPSLY_USERNAME as string,
          process.env.REPSLY_PASSWORD as string,
        )

        const state = randomBytes(32).toString('hex')
        const nonce = randomBytes(32).toString('hex')

        // 5. Obtener nuevos tokens con el sessionToken
        const tokens = await oktaClient.getTokensWithSessionToken(
          sessionToken,
          state,
          nonce,
        )

        // 6. Guardar los nuevos tokens
        await ServiceTokenService.update('repsly', {
          token: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiresIn: tokens.expires_in,
          expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        })

        Log.info('Login successful after refresh token failure')
        await SlackService.sendMessage(
          'Token refreshed successfully through login after refresh token failure',
        )
        return NextResponse.json({ status: 'Token refreshed through login' })
      } catch (loginError) {
        // 7. Si ambos fallan, notificar
        const error = `Refresh token and login failed. Refresh error: ${
          refreshError instanceof Error ? refreshError.message : 'Unknown error'
        }. Login error: ${
          loginError instanceof Error ? loginError.message : 'Unknown error'
        }`
        Log.error(error)
        await SlackService.sendCronJobNotification(
          'Refresh Token',
          'error',
          error,
        )

        return NextResponse.json(
          { error: 'Failed to refresh token and login' },
          { status: 500 },
        )
      }
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    Log.error('Token refresh process failed', { error: errorMessage })
    await SlackService.sendCronJobNotification(
      'Refresh Token',
      'error',
      errorMessage,
    )

    return NextResponse.json(
      { error: 'Token refresh process failed' },
      { status: 500 },
    )
  }
}
