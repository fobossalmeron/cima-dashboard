'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
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
            {navItems.map((item) => (
              <NavigationMenuItem key={item.path}>
                <Link
                  href={`/${clientId}/${item.path}`}
                  legacyBehavior
                  passHref
                >
                  <NavigationMenuLink
                    className={`${navigationMenuTriggerStyle()} ${
                      pathname === `/${clientId}/${item.path}`
                        ? 'bg-accent text-accent-foreground'
                        : ''
                    }`}
                  >
                    {item.title}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </SheetContent>
    </Sheet>
  )
}
