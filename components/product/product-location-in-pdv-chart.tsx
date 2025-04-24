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
import { useMemo } from 'react'
import { ProductLocationInPDVChartData } from './product.types'

/**
 * Componente que muestra un gráfico de barras con la ubicación de productos en punto de venta.
 *
 * @param {{data: {location: string, quantity: number}[]}} props
 * @property {string} location - Nombre de la ubicación en el punto de venta
 * @property {number} quantity - Cantidad de ocaciones que un producto se colocó en esta ubicación
 */

export function ProductLocationInPDVChart({
  data,
}: {
  data: ProductLocationInPDVChartData[]
}) {
  // Calcular el total y los porcentajes para cada ubicación y ordenar de mayor a menor
  const dataWithPercentages = useMemo(() => {
    const total = data.reduce((sum, item) => sum + item.quantity, 0)

    // Crear array con porcentajes
    const dataWithPercentagesArray = data.map((item) => ({
      ...item,
      percentage: total > 0 ? Math.round((item.quantity / total) * 100) : 0,
    }))

    // Ordenar de mayor a menor por cantidad
    return dataWithPercentagesArray.sort((a, b) => b.quantity - a.quantity)
  }, [data])

  return (
    <Card className="md:col-span-2 col-span-1">
      <CardHeader>
        <CardTitle>Ubicación del producto en punto de venta</CardTitle>
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
              dataKey="location"
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
                  const { location, quantity } = payload[0].payload
                  return (
                    <div className="bg-background border border-border p-3">
                      <p className="text-base">{location}</p>
                      <p
                        className="text-base"
                        style={{ color: payload[0].color }}
                      >
                        {quantity} ocasiones
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="quantity" fill="#8884d8">
              <LabelList
                dataKey="percentage"
                position="center"
                fill="#ffffff"
                className="text-sm font-semibold"
                formatter={(value: number) => `${value}%`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
