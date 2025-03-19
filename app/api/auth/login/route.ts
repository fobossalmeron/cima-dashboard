import { AuthController } from '@/lib/controllers/auth/auth.controller'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  return AuthController.login(req)
}
