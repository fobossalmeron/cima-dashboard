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
  Cell,
} from 'recharts'
import { TotalSalesByBrandData } from '@/components/sales/sales.types'
import type { LabelProps } from 'recharts'

/**
 * Componente que muestra un gráfico de barras con el total de ventas por marca.
 *
 * @param {TotalSalesByBrandData[]} props.data
 * @property {string} brand - Nombre de la marca
 * @property {number} quantity - Cantidad de ventas de esta marca
 */

const chartColors = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEEAD',
  '#D4A5A5',
  '#9B786F',
  '#6C88C4',
  '#FFB6B9',
  '#8785A2',
]

export function TotalSalesByBrand({ data }: { data: TotalSalesByBrandData[] }) {
  const sortedData = [...data].sort((a, b) => b.quantity - a.quantity)

  // Etiqueta personalizada para mostrar el quantity arriba de cada barra
  function renderCustomLabel(props: LabelProps) {
    const { x, y, width, value } = props
    if (
      typeof x !== 'number' ||
      typeof y !== 'number' ||
      typeof width !== 'number'
    )
      return <g />
    return (
      <text
        x={x + width / 2}
        y={y - 8}
        textAnchor="middle"
        fontSize={12}
        fill="#6B7280" // gris Tailwind
        fontWeight={500}
      >
        {value}
      </text>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas totales por submarca</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sortedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="brand" fontSize={12} />
            <YAxis
              tickFormatter={(value) => `${value.toLocaleString()}`}
              fontSize={12}
            />
            <Tooltip
              formatter={(value: number) => [`${value} unidades vendidas`]}
            />
            <Bar dataKey="quantity" fill="#000" label={renderCustomLabel}>
              {sortedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={chartColors[index % chartColors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
