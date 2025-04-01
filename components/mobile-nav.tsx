'use client'

import { useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { navItems } from '@/data/nav'
import Link from 'next/link'

interface MobileNavProps {
  clientId: string
}

export function MobileNav({ clientId }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Verificar si estamos en la URL base del cliente
  const isClientBasePath = pathname === `/${clientId}`

  // Verificar si el parámetro show-ambassadors está presente
  const showAmbassadors = searchParams.get('show-ambassadors') === 'true'

  // Crear una nueva URLSearchParams con los parámetros actuales
  const createUrlWithCurrentParams = (path: string) => {
    const params = new URLSearchParams(searchParams.toString())
    return `${path}${params.toString() ? `?${params.toString()}` : ''}`
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="default" size="default" className="lg:hidden">
          <Menu className="h-20 w-20" />
          Menú
          <span className="sr-only">Abrir menú</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[300px] items-start justify-center px-4"
      >
        <SheetHeader>
          <SheetTitle>Menú</SheetTitle>
        </SheetHeader>
        <NavigationMenu>
          <NavigationMenuList className="flex flex-col gap-4 items-start justify-center w-full">
            {navItems.map((item) => {
              // Determinar si este ítem debe estar activo
              const isActive =
                pathname === `/${clientId}/${item.path}` ||
                (isClientBasePath && item.path === '/')

              const href = createUrlWithCurrentParams(
                `/${clientId}/${item.path}`,
              )

              return (
                <NavigationMenuItem key={item.path}>
                  <Link href={href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={`${navigationMenuTriggerStyle()} ${
                        isActive ? 'bg-accent text-accent-foreground' : ''
                      }`}
                    >
                      {item.title}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )
            })}

            {showAmbassadors && (
              <NavigationMenuItem>
                <Link
                  href={createUrlWithCurrentParams(`/${clientId}/ambassadors`)}
                  legacyBehavior
                  passHref
                >
                  <NavigationMenuLink
                    className={`${navigationMenuTriggerStyle()} ${
                      pathname === `/${clientId}/ambassadors`
                        ? 'bg-accent text-accent-foreground'
                        : ''
                    }`}
                  >
                    Promotoras
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </SheetContent>
    </Sheet>
  )
}
