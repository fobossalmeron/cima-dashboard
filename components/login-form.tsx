'use client'
//#region React and external libraries
// React and external libraries
import type React from 'react'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// UI Components (shadcn)
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FormInput,
} from '@/components/ui'

// Utilities and types
import { cn } from '@/lib/utils'
import { loginSchema, type LoginFormValues } from '@/lib/schemas/auth'
import { authClient } from '@/lib/auth/auth-client'

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    const { email, password } = values
    const callbackUrl = searchParams.get('callbackUrl') || '/'

    // Limpiar el mensaje de error al intentar nuevamente
    setErrorMessage(null)

    await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: callbackUrl,
      },
      {
        onRequest: () => {
          setIsLoading(true)
        },
        onSuccess: () => {
          form.reset()
          setIsLoading(false)
        },
        onError: (ctx) => {
          setIsLoading(false)
          const errorMsg =
            ctx.error?.error?.message ||
            ctx.error?.message ||
            'Error al iniciar sesión'

          setErrorMessage(errorMsg)
        },
      },
    )
  }

  if (!mounted) {
    return null
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
          <CardDescription>
            Ingresa tus datos para iniciar sesión
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormInput<LoginFormValues>
                name="email"
                label="Email"
                type="email"
                placeholder="admin@cima.com"
              />
              <FormInput<LoginFormValues>
                name="password"
                label="Contraseña"
                type="password"
                placeholder="••••••••"
              />
              {errorMessage && (
                <div className="text-sm text-red-500 font-medium">
                  {errorMessage}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  )
}
