import type React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import Providers from '@/components/providers/providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cima Demos Dashboard',
  description: 'Dashboard for Cima Sales Demos',
  icons: {
    icon: '/favicon.ico?v=2',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Toaster />
        <Providers>
          <div className="flex h-screen">
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
