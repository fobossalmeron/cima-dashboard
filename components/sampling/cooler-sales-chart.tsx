'use client'

import * as React from 'react'
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
  LabelList,
} from 'recharts'
import { CoolerSalesChartData } from './sampling.types'

const COLORS = [
  '#0088FE', // Azul para "Con cooler"
  '#FF8042', // Naranja para "Sin cooler"
]

/**
 * Componente que muestra un gráfico de barras con las ventas totales de demos separadas por cooler.
 *
 * @param {CoolerSalesChartData[]} props.data
 * @property {string} type - Tipo de punto de venta ("Con cooler" o "Sin cooler")
 * @property {number} ventas - Total de ventas para este tipo
 */

export function CoolerSalesChart({ data }: { data: CoolerSalesChartData[] }) {
  // Filtrar datos que tengan ventas mayor a 0
  const filteredData = data.filter((item) => item.ventas > 0)

  // Si no hay datos válidos, no renderizar el componente
  if (filteredData.length === 0) {
    return null
  }

  // Personalización del tooltip
  interface CustomTooltipProps {
    active?: boolean
    payload?: Array<{
      payload: CoolerSalesChartData
      dataKey: string
      name: string
      color: string
      value: number
    }>
    label?: string
  }

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
          <p className="text-base font-medium">{label}</p>
          <p className="text-base" style={{ color: data.color }}>
            Ventas: {data.value?.toLocaleString('es-MX')}
          </p>
        </div>
      )
    }
    return null
  }

  // Función personalizada para renderizar las etiquetas dentro de las barras
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderCustomLabel = (props: any) => {
    const { x, y, width, value } = props

    // Convertir a números si es necesario
    const xPos = typeof x === 'string' ? parseFloat(x) : x || 0
    const yPos = typeof y === 'string' ? parseFloat(y) : y || 0
    const widthNum = typeof width === 'string' ? parseFloat(width) : width || 0

    return (
      <text
        x={xPos + widthNum / 2}
        y={yPos + 20}
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-sm font-normal"
      >
        ${value?.toLocaleString('es-MX')}
      </text>
    )
  }

  return (
    <Card className="lg:col-span-1 md:col-span-1 col-span-1">
      <CardHeader>
        <CardTitle>Coolers - Ventas durante demos</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={filteredData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="type" className="text-sm" tick={{ fontSize: 12 }} />
            <YAxis
              className="text-sm"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.toLocaleString('es-MX')}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="ventas" radius={[4, 4, 0, 0]} name="Ventas">
              {filteredData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
              <LabelList content={renderCustomLabel} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
