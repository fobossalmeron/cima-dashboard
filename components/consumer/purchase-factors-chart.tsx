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
} from 'recharts'
import { useMemo } from 'react'
import { PurchaseFactorsChartData } from './consumer.types'

/**
 * Componente que muestra un gráfico de barras con los factores de decisión de compra.
 *
 * @param {PurchaseFactorsChartData[]} props.data
 * @property {string} factor - El nombre del factor de decisión de compra (e.g. "Precio", "Calidad", etc.)
 * @property {number} quantity - La cantidad de consumidores que eligieron ese factor
 */

export function PurchaseFactorsChart({
  data,
}: {
  data: PurchaseFactorsChartData[]
}) {
  const chartData = useMemo(() => {
    const total = data.reduce((sum, item) => sum + item.quantity, 0)

    return data.map((item) => ({
      factor: item.factor,
      quantity: item.quantity,
      porcentaje:
        total > 0 ? Number(((item.quantity / total) * 100).toFixed(1)) : 0,
    }))
  }, [data])

  return (
    <Card>
      <CardHeader className="p-6">
        <CardTitle>Factores de decisión de compra</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="factor"
              style={{ fontSize: '12px' }}
              padding={{ left: 0, right: 0 }}
            />
            <YAxis dataKey="quantity" style={{ fontSize: '12px' }} width={25} />
            <Tooltip formatter={(value: number) => [`${value} demos`]} />
            <Bar
              dataKey="quantity"
              fill="hsl(217, 91%, 60%)"
              className="font-semibold"
              label={{
                position: 'center',
                fill: 'white',
                fontSize: 12,
                formatter: (value: number) => {
                  const item = chartData.find((item) => item.quantity === value)
                  return item ? `${item.porcentaje}%` : ''
                },
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
