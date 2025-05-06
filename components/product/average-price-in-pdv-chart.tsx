'use client'

import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AveragePriceInPDVChartData } from './product.types'

// Paleta de colores base para asignar dinámicamente
const COLOR_PALETTE = [
  '#0088FE', // Azul
  '#00C49F', // Verde
  '#FFBB28', // Amarillo/Naranja
  '#FF8042', // Naranja intenso
  '#8884D8', // Morado
  '#82ca9d', // Verde pastel
  '#ffc658', // Amarillo claro
  '#8dd1e1', // Azul claro
  '#a4de6c', // Verde lima
  '#d0ed57', // Verde oliva
]

// Definir una interfaz específica para el tooltip
interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    payload: Record<string, unknown>
    dataKey: string
    value: number
    color: string
    name: string
  }>
}

/**
 * Componente que muestra un gráfico de barras con el precio promedio de un producto en diferentes puntos de venta.
 *
 * @param {{data: AveragePriceInPDVChartData[]}} props
 * @property {AveragePriceInPDVChartData[]} data - Datos del gráfico
 **/

export function AveragePriceInPDVChart({
  data,
}: {
  data: AveragePriceInPDVChartData[]
}) {
  // Extraer todos los tipos de PDV únicos de los datos
  const pdvTypes = useMemo(() => {
    if (!data || data.length === 0) return []

    // Conjunto para almacenar tipos únicos de PDV
    const uniquePdvTypes = new Set<string>()

    // Recorrer todos los elementos y extraer los tipos de PDV
    data.forEach((item) => {
      if (
        item.averagePriceByPdvType &&
        typeof item.averagePriceByPdvType === 'object'
      ) {
        Object.keys(item.averagePriceByPdvType).forEach((pdvType) => {
          uniquePdvTypes.add(pdvType)
        })
      }
    })

    return Array.from(uniquePdvTypes)
  }, [data])

  // Generar un mapa de colores dinámicamente según los tipos de PDV
  const pdvTypeColors = useMemo(() => {
    const colorMap: Record<string, string> = {}
    pdvTypes.forEach((pdvType, index) => {
      colorMap[pdvType] = COLOR_PALETTE[index % COLOR_PALETTE.length]
    })
    return colorMap
  }, [pdvTypes])

  // Transformar datos para el formato necesario para el gráfico de barras apiladas
  const formattedData = useMemo(() => {
    if (!data || data.length === 0) return []

    return data
      .filter(
        (item) =>
          item.averagePriceByPdvType &&
          typeof item.averagePriceByPdvType === 'object',
      )
      .sort((a, b) => {
        // Ordenar primero por el PDV con el precio más alto
        const valuesA = Object.values(a.averagePriceByPdvType || {})
        const valuesB = Object.values(b.averagePriceByPdvType || {})
        const maxPriceA = valuesA.length > 0 ? Math.max(...valuesA) : 0
        const maxPriceB = valuesB.length > 0 ? Math.max(...valuesB) : 0
        return maxPriceB - maxPriceA
      })
      .map((item) => ({
        brand: item.brand,
        ...(item.averagePriceByPdvType || {}),
      }))
  }, [data])

  // Helper para mostrar el nombre correcto del tipo de PDV
  function getDisplayType(type: string): string {
    return type === 'Minimarket' || type === 'Conveniencia' ? 'C-Store' : type
  }

  // Componente personalizado para el Tooltip
  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const brand = payload[0].payload.brand as string

      return (
        <div className="bg-white border border-gray-200 p-3 rounded-md shadow-sm">
          <p className="font-semibold">{brand}</p>
          {payload.map((entry, entryIndex) => (
            <p key={`tooltip-${entryIndex}`} style={{ color: entry.color }}>
              {getDisplayType(entry.name)}: ${entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      )
    }

    return null
  }

  // Formato para los valores en los ejes
  const formatAxisValue = (value: number) => `$${value.toFixed(2)}`

  // Si no hay datos o tipos de PDV, mostrar mensaje
  if (formattedData.length === 0 || pdvTypes.length === 0) {
    return (
      <Card className="md:col-span-2 col-span-1 w-full">
        <CardHeader>
          <CardTitle>Precio promedio por tipo de tienda</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[400px]">
          <p className="text-gray-500">No hay datos disponibles para mostrar</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="md:col-span-2 col-span-1 w-full">
      <CardHeader>
        <CardTitle>Precio promedio por tipo de tienda</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={formattedData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <XAxis
              type="number"
              tickFormatter={formatAxisValue}
              domain={[0, 'dataMax + 0.1']}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="brand"
              width={90}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            {pdvTypes.map((pdvType) => (
              <Bar
                key={`bar-${pdvType}`}
                dataKey={pdvType}
                name={getDisplayType(pdvType)}
                fill={pdvTypeColors[pdvType]}
              >
                <LabelList
                  dataKey={pdvType}
                  position="right"
                  formatter={formatAxisValue}
                  style={{ fontSize: '10px' }}
                />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>

        {/* Leyenda personalizada similar a product-status-in-pdv-chart.tsx */}
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {pdvTypes.map((pdvType, index) => (
            <div key={`legend-${index}`} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: pdvTypeColors[pdvType] }}
              />
              <span
                className="text-sm"
                style={{ color: pdvTypeColors[pdvType] }}
              >
                {getDisplayType(pdvType)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
