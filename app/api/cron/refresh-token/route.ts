import { RepslyApiService } from '@/lib/services/api'
import { ServiceTokenService } from '@/lib/services/db'
import { SyncStatus } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const tokenData = await ServiceTokenService.findByService('repsly')
    if (!tokenData?.expiresAt) {
      return Response.json({ error: 'No token data found' }, { status: 404 })
    }

    const refreshTokenData = {
      client_id: tokenData.serviceClientId || '',
      refresh_token: tokenData.refreshToken || '',
    }

    await RepslyApiService.refreshToken(refreshTokenData)
    await ServiceTokenService.createLog(
      'repsly',
      SyncStatus.SUCCESS,
      'Token refreshed successfully',
    )
    return Response.json({ status: 'Token refreshed successfully' })
  } catch (error) {
    console.error('Error refreshing token:', error)
    await ServiceTokenService.createLog(
      'repsly',
      SyncStatus.ERROR,
      error instanceof Error ? error.message : 'Unknown error',
    )
    return Response.json({ error: 'Failed to refresh token' }, { status: 500 })
  }
}
