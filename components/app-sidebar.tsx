import { BarChart, Users, ShoppingBag, DollarSign, UserCheck } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

const sidebarItems = [
  { name: "KPIs Generales", icon: BarChart, href: "/" },
  { name: "Información del Producto", icon: ShoppingBag, href: "/product-info" },
  { name: "Perfil del consumidor", icon: Users, href: "/consumer-profile" },
  { name: "Indicadores de ventas", icon: DollarSign, href: "/sales-indicators" },
  { name: "Indicadores de ventas por producto", icon: ShoppingBag, href: "/product-sales" },
  { name: "Embajadoras de marca", icon: UserCheck, href: "/brand-ambassadors" },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

