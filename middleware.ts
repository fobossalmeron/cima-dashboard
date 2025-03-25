/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, type NextRequest } from 'next/server'

const DEFAULT_REDIRECT_PATH = '/admin'
const LOGIN_PATH = '/login'
const SIGN_UP_PATH = '/sign-up'
const AUTH_PATHS = [LOGIN_PATH]
const PUBLIC_PATHS = [...AUTH_PATHS]
const PRIVATE_PATHS = ['/admin']
const FORBIDDEN_PATHS = [SIGN_UP_PATH]

async function getSession(request: NextRequest) {
  try {
    const response = await fetch(
      `${request.nextUrl.origin}/api/auth/get-session`,
      {
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      },
    )

    if (!response.ok) return null

    return response.json()
  } catch (error) {
    console.error('Error fetching session:', error)
    return null
  }
}

async function tryToRedirectToDefaultAuthPath(
  request: NextRequest,
  session: any,
) {
  const isAuthPath = AUTH_PATHS.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  )
  if (session && isAuthPath) {
    return new URL(DEFAULT_REDIRECT_PATH, request.url)
  }

  return null
}

async function tryToRedirectToBasePath(request: NextRequest, session: any) {
  const isBasePath = request.nextUrl.pathname === '/'
  if (isBasePath) {
    if (session) {
      return new URL(DEFAULT_REDIRECT_PATH, request.url)
    } else {
      return new URL(LOGIN_PATH, request.url)
    }
  }
  return null
}

async function tryToRedirectToLogin(request: NextRequest, session: any) {
  const isForbiddenPath = FORBIDDEN_PATHS.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  )

  // Rutas públicas que no requieren autenticación
  const isPublicPath = PUBLIC_PATHS.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  )

  const isPrivatePath =
    PRIVATE_PATHS.some((path) => request.nextUrl.pathname.startsWith(path)) &&
    !isPublicPath

  // Redirigir al login si no hay sesión y la ruta no es pública y es privada
  if (isForbiddenPath || (!session && isPrivatePath)) {
    const signInUrl = new URL(LOGIN_PATH, request.url)
    signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return signInUrl
  }
  return null
}

export async function middleware(request: NextRequest) {
  const session = await getSession(request)

  const redirectAuthUrl = await tryToRedirectToDefaultAuthPath(request, session)

  if (redirectAuthUrl) {
    return NextResponse.redirect(redirectAuthUrl)
  }

  const redirectBaseUrl = await tryToRedirectToBasePath(request, session)
  if (redirectBaseUrl) {
    return NextResponse.redirect(redirectBaseUrl)
  }

  const redirectLoginUrl = await tryToRedirectToLogin(request, session)
  if (redirectLoginUrl) {
    return NextResponse.redirect(redirectLoginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
