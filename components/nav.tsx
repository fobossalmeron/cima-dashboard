'use client'

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navItems } from '@/data/nav'
import { cn } from '@/lib/utils'

interface NavProps {
  className?: string
  clientId: string
  dashboardId: string
}

export const Nav = ({ className, clientId, dashboardId }: NavProps) => {
  const pathname = usePathname()

  // Verificar si estamos en la URL base del cliente
  const isClientBasePath = pathname === `/${clientId}/${dashboardId}`

  return (
    <NavigationMenu>
      <NavigationMenuList className={cn('gap-5', className)}>
        {navItems.map((item) => {
          // Determinar si este ítem debe estar activo
          const isActive =
            pathname === `/${clientId}/${dashboardId}/${item.path}` ||
            (isClientBasePath && item.path === '/')

          return (
            <NavigationMenuItem key={item.path}>
              <Link
                href={`/${clientId}/${dashboardId}/${item.path}`}
                legacyBehavior
                passHref
              >
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} relative hover:bg-transparent active:bg-transparent focus:bg-transparent focus-visible:bg-transparent data-[state=open]:bg-transparent data-[active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full print:after:w-full print:after:bg-primary  after:bg-primary after:transition-all after:duration-300 p-0 ${
                    isActive
                      ? 'after:w-full after:bg-primary print:after:hidden print:border-2 print:border-primary'
                      : ''
                  }`}
                >
                  <span className="px-2 py-2 block active:scale-95 transition-transform duration-150">
                    {item.title}
                  </span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
