import { AuthController } from '@/lib/controllers/auth/auth.controller'
import { NextRequest } from 'next/server'
import { runtime } from '@/lib/config/runtime'

export { runtime }

export async function GET(req: NextRequest) {
  return AuthController.validateSession(req)
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
