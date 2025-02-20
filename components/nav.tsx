"use client";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/data/nav";

export const Nav = ({ className }: { className?: string }) => {
  const pathname = usePathname();

  return (
    <NavigationMenu>
      <NavigationMenuList className={className}>
        {navItems.map((item) => (
          <NavigationMenuItem key={item.path}>
            <Link href={item.path} legacyBehavior passHref>
              <NavigationMenuLink 
                className={`${navigationMenuTriggerStyle()} ${
                  pathname === item.path ? "bg-accent text-accent-foreground" : ""
                }`}
              >
                {item.title}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};