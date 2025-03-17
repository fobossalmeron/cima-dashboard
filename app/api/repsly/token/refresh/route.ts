import { ApiStatus } from '@/enums/api-status'
import { AuthService } from '@/lib/services/db/auth.service'
import { NextResponse } from 'next/server'

export async function POST() {
  const refreshTokenResponse = await AuthService.refreshToken()

  if (refreshTokenResponse.status === ApiStatus.ERROR) {
    return NextResponse.json(refreshTokenResponse, {
      status: refreshTokenResponse.statusCode,
    })
  }

  const { data } = refreshTokenResponse

  return NextResponse.json(data, { status: 200 })
}
