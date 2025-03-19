import type React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/lib/contexts/auth-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cima Sampling Dashboard',
  description: 'Dashboard for sampling activations',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex h-screen">
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}

import './globals.css'
