import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/services/auth/auth.service'

export class AuthController {
  static async login(req: NextRequest) {
    try {
      const { email, password } = await req.json()

      const result = await AuthService.login(email, password)

      return NextResponse.json(result)
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 401 })
      }

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      )
    }
  }

  static async logout(req: NextRequest) {
    try {
      const token = req.cookies.get('session')?.value

      if (!token) {
        return NextResponse.json(
          { error: 'No active session' },
          { status: 401 },
        )
      }

      await AuthService.logout(token)

      return NextResponse.json({ message: 'Session closed correctly' })
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 401 })
      }

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      )
    }
  }

  static async validateSession(req: NextRequest) {
    try {
      const token = req.cookies.get('session')?.value

      if (!token) {
        return NextResponse.json(
          { error: 'No active session' },
          { status: 401 },
        )
      }

      const user = await AuthService.validateSession(token)

      return NextResponse.json({ user })
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 401 })
      }

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      )
    }
  }
}
