'use client'
import { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { getQueryClient } from '@/lib/tanstack'
import { AuthProvider } from '@/lib/contexts/auth-context'

export default function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools />
      </QueryClientProvider>
    </AuthProvider>
  )
}
