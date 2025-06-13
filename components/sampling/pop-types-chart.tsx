'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts'
import { POPTypesChartData } from './sampling.types'

/**
 * Componente que muestra un gráfico de barras con los tipos de material POP y sus cantidades.
 *
 * @param {{data: {type: string, quantity: number}[]}} props
 * @property {string} type - Tipo de material POP (ej. "Cintillo", "Dangler", "Preciador")
 * @property {number} quantity - Cantidad de material POP de este tipo
 */

export function POPTypesChart({ data }: { data: POPTypesChartData[] }) {
  // Si no hay datos, mostrar mensaje
  if (data.length === 0) {
    return (
      <Card className="md:col-span-2 col-span-1 print:col-span-2">
        <CardHeader>
          <CardTitle>
            Material POP - Tipos de material POP en puntos de venta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground text-sm">
              No se encontraron datos de tipos de material POP
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calcular el total y los porcentajes para cada tipo y ordenar de mayor a menor
  const total = data.reduce((sum, item) => sum + item.quantity, 0)

  const dataWithPercentages = data
    .map((item) => ({
      ...item,
      percentage: total > 0 ? Math.round((item.quantity / total) * 100) : 0,
    }))
    .sort((a, b) => b.quantity - a.quantity)

  return (
    <Card className="md:col-span-2 col-span-1 print:col-span-2">
      <CardHeader>
        <CardTitle>
          Material POP - Tipos de material POP en puntos de venta
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={dataWithPercentages}
            barGap={0}
            barCategoryGap={10}
            margin={{ left: -15, right: 20, top: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="type"
              className="text-xs"
              interval={0}
              height={60}
              tick={({ x, y, payload }) => (
                <g transform={`translate(${x},${y})`}>
                  <foreignObject
                    x={-50}
                    y={0}
                    width={100}
                    height={60}
                    className="overflow-visible"
                  >
                    <div
                      className="text-xs text-center break-words w-full"
                      style={{
                        color: '#666',
                        lineHeight: '1.2',
                        padding: '0 2px',
                      }}
                    >
                      {payload.value}
                    </div>
                  </foreignObject>
                </g>
              )}
            />
            <YAxis className="text-xs" />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const { type, quantity, percentage } = payload[0].payload
                  return (
                    <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
                      <p className="text-base font-medium">{type}</p>
                      <p
                        className="text-base"
                        style={{ color: payload[0].color }}
                      >
                        {quantity} elementos ({percentage}%)
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar
              dataKey="quantity"
              fill="#10B981"
              radius={[4, 4, 0, 0]}
              name="Cantidad"
            >
              <LabelList
                dataKey="quantity"
                position="top"
                className="text-xs font-medium"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
