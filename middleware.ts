import { NextResponse, type NextRequest } from "next/server";

const DEFAULT_REDIRECT_PATH = "/admin";
const LOGIN_PATH = "/login";
const SIGN_UP_PATH = "/sign-up";
const AUTH_PATHS = [LOGIN_PATH, SIGN_UP_PATH];
const PUBLIC_PATHS = [...AUTH_PATHS];

async function getSession(request: NextRequest) {
  try {
    const response = await fetch(
      `${request.nextUrl.origin}/api/auth/get-session`,
      {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      },
    );

    if (!response.ok) return null;

    return response.json();
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const isAuthPath = AUTH_PATHS.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );
  const session = await getSession(request);

  if (session && isAuthPath) {
    return NextResponse.redirect(new URL(DEFAULT_REDIRECT_PATH, request.url));
  }

  // Rutas públicas que no requieren autenticación
  const isPublicPath = PUBLIC_PATHS.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  // Redirigir al login si no hay sesión y la ruta no es pública
  if (!session && !isPublicPath) {
    const signInUrl = new URL(LOGIN_PATH, request.url);
    signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
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
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
