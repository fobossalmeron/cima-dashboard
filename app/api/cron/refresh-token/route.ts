import { NextRequest, NextResponse } from 'next/server'
import { RepslyAuthService } from '@/lib/services'
import { Log } from '@/lib/utils/log'
import { ApiStatus } from '@/enums/api-status'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const response = await RepslyAuthService.refreshToken()

    if (response.status === ApiStatus.SUCCESS) {
      return NextResponse.json({ status: 'Token refreshed successfully' })
    } else {
      const errorMessage = response.error || 'Unknown error'
      Log.error('Error refreshing token', { error: errorMessage })
      return NextResponse.json(
        { error: 'Failed to refresh token' },
        { status: 500 },
      )
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    Log.error('Error refreshing token', { error: errorMessage })
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 },
    )
  }
}
