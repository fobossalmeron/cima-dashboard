import { ApiStatus } from '@/enums/api-status'
import { RepslyAuthService } from '@/lib/services'
import { NextResponse } from 'next/server'

export async function POST() {
  const refreshTokenResponse = await RepslyAuthService.refreshToken()

  if (refreshTokenResponse.status === ApiStatus.ERROR) {
    return NextResponse.json(refreshTokenResponse, {
      status: refreshTokenResponse.statusCode,
    })
  }

  const { data } = refreshTokenResponse

  return NextResponse.json(data, { status: 200 })
}
