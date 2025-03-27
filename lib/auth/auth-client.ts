import { createAuthClient } from 'better-auth/react'

// Función para obtener la URL base actual
function getBaseUrl() {
  // Si estamos en el navegador, usar la URL actual
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  // Si estamos en el servidor, usar la URL proporcionada o la URL por defecto
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://dashboard.cimasales.com'
}

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
})
