import { prisma } from '@/lib/prisma'
import { ServiceToken } from '@prisma/client'

export async function getServiceToken(
  service: string,
): Promise<ServiceToken | null> {
  try {
    const token = await prisma.serviceToken.findUnique({
      where: { service },
    })

    if (!token) {
      return null
    }

    // Verificar si el token ha expirado
    if (token.expiresAt && token.expiresAt < new Date()) {
      // Aquí podrías implementar la lógica para refrescar el token si es necesario
      return null
    }

    return token
  } catch (error) {
    console.error('Error al obtener el token:', error)
    return null
  }
}
