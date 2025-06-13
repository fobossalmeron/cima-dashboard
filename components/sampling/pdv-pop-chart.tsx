'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Label,
} from 'recharts'
import { PDVPOPChartData } from './sampling.types'

const COLORS = ['#10B981', '#EF4444']

/**
 * Componente que muestra un gráfico circular con la distribución de puntos de venta con material POP o sin él.
 *
 * @param {PDVPOPChartData[]} props.data
 * @property {string} type - Tipo de punto de venta ("Con POP" o "Sin POP")
 * @property {number} quantity - Número de puntos de venta de este tipo
 */

export function PDVPOPChart({ data }: { data: PDVPOPChartData[] }) {
  const totalPdv = data.reduce((sum, item) => sum + item.quantity, 0)

  // Si no hay datos o el total es 0, mostrar mensaje
  if (data.length === 0 || totalPdv === 0) {
    return (
      <Card className="lg:col-span-1 md:col-span-2 col-span-1 print:col-span-1">
        <CardHeader>
          <CardTitle>Material POP - Puntos de venta con material POP</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[260px] flex items-center justify-center">
            <p className="text-muted-foreground text-sm">
              No se encontraron datos de material POP
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Personalización del tooltip
  interface CustomTooltipProps {
    active?: boolean
    payload?: Array<{
      payload: PDVPOPChartData
      dataKey: string
      name: string
      color: string
    }>
  }

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const currentData = payload[0].payload

      // Encontrar el índice del elemento en el array de datos
      const dataIndex = data.findIndex((item) => item.type === currentData.type)
      const colorIndex = dataIndex >= 0 ? dataIndex % COLORS.length : 0
      const color = COLORS[colorIndex]

      return (
        <div className="bg-background border border-border p-3">
          <p className="text-base">{currentData.type}</p>
          <p className="text-base" style={{ color: color }}>
            {currentData.quantity} puntos de venta
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="lg:col-span-1 md:col-span-2 col-span-1 print:col-span-1">
      <CardHeader>
        <CardTitle>Material POP - Puntos de venta con material POP</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey="quantity"
              nameKey="type"
              labelLine={false}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              className="font-semibold"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalPdv}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          PDV
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center gap-3 gap-y-1">
          {data.map((entry, index) => (
            <div
              key={`legend-${index}`}
              className="flex items-center gap-2"
              style={{
                breakInside: 'avoid',
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span
                className="text-sm"
                style={{ color: COLORS[index % COLORS.length] }}
              >
                {entry.type}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
