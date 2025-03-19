import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { AuthService } from '@/lib/services'

export const runtime = 'edge'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('session')?.value

    if (!token) {
      return NextResponse.json({ user: null })
    }

    const user = await AuthService.validateSession(token)
    if (!user) {
      return NextResponse.json({ user: null })
    }
    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error validating session:', error)
    return NextResponse.json({ user: null })
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
