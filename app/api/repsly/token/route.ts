import { RepslyAuthService } from '@/lib/services/repsly/repsly-auth.service'
import { NextResponse } from 'next/server'

export async function GET() {
  const token = await RepslyAuthService.getToken()
  return NextResponse.json({ token })
}
