'use client'

import { LoginForm } from '@/components/login-form'
import { useAuth } from '@/lib/contexts/auth-context'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoadingSpinner() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center">
      <div className="text-lg">Cargando...</div>
    </div>
  )
}

function LoginContent() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  if (!isLoading && user) {
    const from = searchParams?.get('from') || '/admin'
    router.push(from)
    return null
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LoginContent />
    </Suspense>
  )
}
