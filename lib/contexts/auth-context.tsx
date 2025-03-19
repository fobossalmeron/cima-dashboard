'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Role } from '@/enums/role'

interface User {
  id: string
  email: string
  name: string | null
  role: Role
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    validateSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function validateSession() {
    try {
      const response = await fetch('/api/auth/session')
      if (response.ok) {
        const data = await response.json()
        if (data.user) {
          setUser(data.user)
        } else {
          setUser(null)
          logout()
        }
      }
    } catch (error) {
      console.error('Error validating session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function login(email: string, password: string) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Error al iniciar sesión')
    }

    const data = await response.json()
    setUser(data.user)
    router.push('/admin')
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
