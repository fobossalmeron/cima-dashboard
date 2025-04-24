'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from 'recharts'
import { AveragePriceInPDVChartData } from './product.types'

// Colores para las barras
const COLORS = [
  '#0088FE', // Azul principal
  '#00C49F', // Verde turquesa
  '#FFBB28', // Amarillo dorado
  '#FF8042', // Naranja intenso
  '#8884D8', // Morado suave
  '#82ca9d', // Verde pastel
  '#ffc658', // Amarillo claro
  '#8dd1e1', // Azul claro
  '#7dce31', // Verde lima
  '#fd7abd', // Verde oliva oscuro (mejor contraste)
  '#ff9f7f', // Salmón
  '#f7a35c', // Naranja pastel
  '#7cb5ec', // Azul cielo
  '#434348', // Gris oscuro
  '#90ed7d', // Verde menta
]

// Definir una interfaz específica para el tooltip
interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    payload: AveragePriceInPDVChartData
    dataKey: string
    value: number
    color: string
  }>
}

/**
 * Componente que muestra un gráfico de barras con el precio promedio de un producto en diferentes puntos de venta.
 *
 * @param {{data: AveragePriceInPDVChartData[]}} props
 * @property {AveragePriceInPDVChartData[]} data - Datos del gráfico
 * @property {string} brand - Nombre de marca y presentación, no de sabores. Ejemplo: "Del Frutal Lata"
 * @property {number} averagePrice - Precio promedio del producto
 **/

export function AveragePriceInPDVChart({
  data,
}: {
  data: AveragePriceInPDVChartData[]
}) {
  const sortedData = data.sort((a, b) => b.averagePrice - a.averagePrice)

  // Componente personalizado para el Tooltip
  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const currentData = payload[0].payload

      // Encontrar el índice del elemento en el array de datos
      const dataIndex = sortedData.findIndex(
        (item: AveragePriceInPDVChartData) => item.brand === currentData.brand,
      )
      const colorIndex = dataIndex >= 0 ? dataIndex % COLORS.length : 0
      const color = COLORS[colorIndex]

      return (
        <div className="bg-white border border-gray-200 p-3">
          <p>{currentData.brand}</p>
          <p style={{ color: color }}>
            Precio promedio ${currentData.averagePrice.toFixed(2)}
          </p>
        </div>
      )
    }

    return null
  }

  return (
    <Card className="md:col-span-2 col-span-1 w-full">
      <CardHeader>
        <CardTitle>Precio promedio del producto en punto de venta</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
          >
            <XAxis type="number" domain={[0, 'dataMax + 0.5']} hide={true} />
            <YAxis
              type="category"
              dataKey="brand"
              width={150}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="averagePrice" minPointSize={2}>
              <LabelList
                dataKey="averagePrice"
                position="right"
                formatter={(value: number) => `$${value}`}
                style={{ fontSize: '10px' }}
              />
              {sortedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
