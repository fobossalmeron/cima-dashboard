import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const SESSION_EXPIRY = 7 * 24 * 60 * 60 * 1000 // 7 días

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

      const isValidPassword = await compare(password, user.password)

      if (!isValidPassword) {
        throw new Error('Incorrect password')
      }

      // Crear token JWT
      const token = sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: '7d' },
      )

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
}
