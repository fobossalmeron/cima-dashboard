import { AuthController } from '@/lib/controllers/auth/auth.controller'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  return AuthController.validateSession(req)
}
