import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface KPICardProps {
  title: string
  value: string
  suffix?: string
  icon?: LucideIcon
  colorRanges?: {
    green: [number, number]
    yellow: [number, number]
    red: [number, number]
  }
}

function getColorClasses(value: string, colorRanges?: KPICardProps['colorRanges']): {
  cardClass: string;
  iconClass: string;
} {
  if (!colorRanges) return { cardClass: '', iconClass: 'text-muted-foreground' };
  
  const numericValue = parseFloat(value);
  
  if (numericValue >= colorRanges.green[0]) {
    return {
      cardClass: 'border-green-300 bg-green-100',
      iconClass: 'text-green-600'
    };
  }
  if (numericValue >= colorRanges.yellow[0] && numericValue < colorRanges.green[0]) {
    return {
      cardClass: 'border-yellow-300 bg-yellow-100',
      iconClass: 'text-yellow-600'
    };
  }
  if (numericValue < colorRanges.yellow[0]) {
    return {
      cardClass: 'border-red-300 bg-red-100',
      iconClass: 'text-red-600'
    };
  }
  
  return { cardClass: '', iconClass: 'text-muted-foreground' };
}

export function KPICard({ title, value, suffix, icon: Icon, colorRanges }: KPICardProps) {
  const { cardClass, iconClass } = getColorClasses(value, colorRanges);

  return (
    <Card className={`transition-colors ${cardClass}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className={`h-4 w-4 ${iconClass}`} />}
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

