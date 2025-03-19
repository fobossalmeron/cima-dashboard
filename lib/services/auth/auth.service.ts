import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import * as jose from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const SESSION_EXPIRY = 7 * 24 * 60 * 60 * 1000 // 7 días

// Función simple de hash compatible con Edge Runtime
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + JWT_SECRET)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

// Función para verificar contraseña
async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  const hash = await hashPassword(password)
  return hash === hashedPassword
}

export class AuthService {
  static async login(email: string, password: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          password: true,
          role: true,
        },
      })

      if (!user) {
        throw new Error('User not found')
      }

      const isValidPassword = await verifyPassword(password, user.password)

      if (!isValidPassword) {
        throw new Error('Incorrect password')
      }

      // Crear token JWT usando jose
      const secret = new TextEncoder().encode(JWT_SECRET)
      const token = await new jose.SignJWT({
        userId: user.id,
        email: user.email,
        role: user.role,
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(secret)

      // Crear sesión en la base de datos
      const session = await prisma.session.create({
        data: {
          token,
          expiresAt: new Date(Date.now() + SESSION_EXPIRY),
          userId: user.id,
        },
      })

      // Establecer cookie
      const cookieStore = await cookies()
      cookieStore.set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: SESSION_EXPIRY / 1000, // Convertir a segundos
      })

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        session,
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Error logging in')
    }
  }

  static async logout(token: string) {
    // Eliminar sesión
    await prisma.session.delete({
      where: { token },
    })

    // Eliminar cookie
    const cookieStore = await cookies()
    cookieStore.delete('session')
  }

  static async validateSession(token: string) {
    try {
      // Verificar el token JWT
      const secret = new TextEncoder().encode(JWT_SECRET)
      await jose.jwtVerify(token, secret)

      const session = await prisma.session.findUnique({
        where: { token },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
            },
          },
        },
      })

      if (!session) {
        throw new Error('Session not found')
      }

      if (session.expiresAt < new Date()) {
        await prisma.session.delete({
          where: { token },
        })
        throw new Error('Session expired')
      }

      return session.user
    } catch (error) {
      console.log(`Error validating session: ${error}`)
      throw new Error('Invalid session')
    }
  }

  static async logoutAll(userId: string) {
    // Eliminar todas las sesiones del usuario
    await prisma.session.deleteMany({
      where: { userId },
    })

    // Eliminar cookie
    const cookieStore = await cookies()
    cookieStore.delete('session')
  }

  // Método auxiliar para crear hash de contraseña (usado en registro/cambio de contraseña)
  static async hashPassword(password: string): Promise<string> {
    return hashPassword(password)
  }
}
