'use client'

import { Nav } from '@/components/nav'
import { Filters } from '@/components/filters'
import { Separator } from '@/components/ui/separator'
import CimaSVG from '@/public/cima_logo_simple.svg'
import Image from 'next/image'
import { MobileNav } from '@/components/mobile-nav'
import { MobileFilters } from '@/components/mobile-filters'
import { useClient } from '@/lib/context/ClientContext'

export const Header = ({ title }: { title: string }) => {
  const { clientData: client } = useClient()

  return (
    <div className="flex flex-col justify-between items-start w-full gap-8">
      <header className="flex w-full items-center border-b bg-background">
        <div className="flex w-full items-center justify-between gap-2 px-6 py-4 print:pt-0">
          <Image src={CimaSVG} alt="Cima Logo" width={80} height={100} />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="text-xl font-semibold">
            Dashboard de {client.name}
          </div>
        </div>
      </header>
      <div className="w-full flex items-center gap-2 justify-between px-6">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <div className="container lg:hidden print:hidden w-auto">
          <MobileNav clientId={client.slug} />
        </div>
        <nav className="hidden lg:flex print:hidden">
          <Nav clientId={client.slug} />
        </nav>
      </div>
      <div className="w-full flex items-center gap-2 justify-between px-6">
        <div className="container lg:hidden print:hidden w-auto">
          <MobileFilters />
        </div>
        <div className="hidden lg:block print:block w-full">
          <Filters />
        </div>
      </div>
    </div>
  )
}
