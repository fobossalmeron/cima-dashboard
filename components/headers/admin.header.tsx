'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { MoreVertical, LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import CimaSVG from '@/public/cima_logo_simple.svg'

export function AdminHeader() {
  return (
    <header className="flex w-full items-center border-b bg-background">
      <div className="flex w-full items-center justify-between gap-2 px-6 py-4">
        <Image src={CimaSVG} alt="Cima Logo" width={80} height={100} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:bg-transparent hover:text-foreground"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={() => {
                window.location.href = '/login'
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
