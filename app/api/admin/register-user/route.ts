import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/services/auth/auth.service'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const { name, email, password } = body
  if (!name || !email || !password) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 },
    )
  }
  try {
    const user = await AuthService.register({ name, email, password })
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error registering user:', error)
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 },
    )
  }
}
