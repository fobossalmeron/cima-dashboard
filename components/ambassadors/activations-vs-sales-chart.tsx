'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Ambassador } from './ambassadors.types'
import { formatName } from './ambassadors-utils'

/**
 * Componente que muestra un gráfico de barras con las demos y el promedio de ventas por embajadora.
 * @param {Ambassador[]} data
 * @property {string} name - Nombre de la embajadora.
 * @property {number} activations - Número de demos.
 * @property {number} averageSales - Promedio de ventas.
 */

export function ActivationsVsSalesChart({ data }: { data: Ambassador[] }) {
  const formattedData = data.map((item) => ({
    ...item,
    shortName: formatName(item.name),
    fullName: item.name,
  }))
  const sortedData = formattedData.sort(
    (a, b) => b.averageSales - a.averageSales,
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Efectividad por embajadora</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              margin={{
                top: 10,
                right: 30,
                left: 10,
                bottom: 20,
              }}
              barGap={0}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="shortName"
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                labelFormatter={(name, entries) => {
                  if (entries && entries.length > 0) {
                    return entries[0].payload.fullName
                  }
                  return name
                }}
              />
              <Legend wrapperStyle={{ fontSize: 14, paddingTop: 25 }} />
              <Bar
                yAxisId="left"
                dataKey="activations"
                fill="#82ca9d"
                name="Demos"
              />
              <Bar
                yAxisId="right"
                dataKey="averageSales"
                fill="#ffc658"
                name="Promedio de ventas"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
