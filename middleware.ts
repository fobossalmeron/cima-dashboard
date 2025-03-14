import { NextResponse } from 'next/server'

export async function middleware() {
  return NextResponse.next()
}

// Configurar el middleware para que se ejecute en todas las rutas de API
export const config = {
  matcher: ['/api/:path*'],
}
