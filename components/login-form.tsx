'use client'
//#region React and external libraries
// React and external libraries
import type React from 'react'
import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

// UI Components (shadcn)
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FormInput,
  FormError,
} from '@/components/ui'

// Hooks and contexts
import { useAuth } from '@/lib/contexts/auth-context'

// Utilities and types
import { cn } from '@/lib/utils'
import { loginSchema, type LoginFormValues } from '@/lib/schemas/auth'

//#endregion

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const { login } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: LoginFormValues) {
    setError(null)
    setIsLoading(true)

    try {
      await login(data.email, data.password)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Error al iniciar sesión')
      }
    } finally {
      setIsLoading(false)
    }
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
              <FormError message={error} />
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
