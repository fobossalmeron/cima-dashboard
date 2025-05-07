'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { ConsumptionMomentsChartData } from './consumer.types'

/**
 * Componente que muestra un gráfico de barras con la distribución de momentos de consumo.
 *
 * @param {ConsumptionMomentsChartData[]} props.data
 * @property {string} moment - Momento de consumo (ej. "Casa", "Trabajo", "Reuniones sociales", etc.)
 * @property {number} quantity - Cantidad de consumidores que eligieron ese momento
 */

export function ConsumptionMomentsChart({
  data,
}: {
  data: ConsumptionMomentsChartData[]
}) {
  const total = data.reduce((sum, item) => sum + item.quantity, 0)
  const dataWithPercentages = data.map((item) => ({
    ...item,
    porcentaje: ((item.quantity / total) * 100).toFixed(1),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Momentos de consumo</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={dataWithPercentages}
            layout="vertical"
            margin={{ left: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" style={{ fontSize: '12px' }} />
            <YAxis
              dataKey="moment"
              type="category"
              style={{ fontSize: '12px' }}
            />
            <Tooltip formatter={(value: number) => [`${value} demos`]} />
            <Bar
              dataKey="quantity"
              fill="#8884d8"
              className="font-semibold"
              label={{
                position: 'center',
                fill: 'white',
                fontSize: 12,
                formatter: (value: number) =>
                  `${((value / total) * 100).toFixed(1)}%`,
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
