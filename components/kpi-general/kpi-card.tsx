import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface KPICardProps {
  title: string
  value: string
  suffix?: string
  icon?: LucideIcon
}

export function KPICard({ title, value, suffix, icon: Icon }: KPICardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          {suffix && <span className="text-sm font-normal ml-1">{suffix}</span>}
        </div>
      </CardContent>
    </Card>
  )
}

