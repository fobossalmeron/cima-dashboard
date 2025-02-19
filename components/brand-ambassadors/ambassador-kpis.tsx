"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ShoppingBag, Target, TrendingUp } from "lucide-react"

const kpis = [
  {
    title: "Embajadoras activas",
    value: "24",
    icon: Users,
  },
  {
    title: "Activaciones totales",
    value: "156",
    icon: Target,
  },
  {
    title: "Productos vendidos",
    value: "2,450",
    icon: ShoppingBag,
  },
  {
    title: "Promedio de ventas",
    value: "$1,280",
    icon: TrendingUp,
  },
]

export function AmbassadorKPIs() {
  return (
    <>
      {kpis.map((kpi) => (
        <Card key={kpi.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <kpi.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

