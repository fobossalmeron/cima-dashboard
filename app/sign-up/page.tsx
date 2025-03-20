/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth/auth-client'
import { registerSchema } from '@/lib/schemas/auth'

export default function SignUpPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    const { name, email, password } = values

    // Limpiar el mensaje de error al intentar nuevamente
    setErrorMessage(null)

    await authClient.signUp.email(
      {
        name,
        email,
        password,
        callbackURL: '/',
      },
      {
        onRequest: () => {
          setLoading(true)
        },
        onSuccess: () => {
          form.reset()
          setLoading(false)
          router.push('/')
        },
        onError: (ctx: any) => {
          setLoading(false)
          setErrorMessage(
            ctx.error?.error?.message || 'Error al crear la cuenta',
          )
        },
      },
    )
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="max-w-[300px] w-full mx-auto flex flex-col gap-6">
          <h1 className="text-[#292929] font-semibold text-lg">
            Crea tu cuenta
          </h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-full"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-[#292929]">Nombre</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nombre"
                        className={`w-full ${
                          fieldState.error
                            ? 'border-red-500 focus-visible:ring-red-500'
                            : 'border-input'
                        }`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-[#292929]">Correo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="correo@dominio"
                        className={`w-full ${
                          fieldState.error
                            ? 'border-red-500 focus-visible:ring-red-500'
                            : 'border-input'
                        }`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-[#292929]">Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className={`w-full ${
                          fieldState.error
                            ? 'border-red-500 focus-visible:ring-red-500'
                            : 'border-input'
                        }`}
                        {...field}
                        placeholder="●●●●●●●●"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {errorMessage && (
                <div className="text-sm text-red-500 font-medium">
                  {errorMessage}
                </div>
              )}
              <Button type="submit" className="w-full">
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
