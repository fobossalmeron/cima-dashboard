'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from 'recharts'
import { GenderDistributionChartData } from './consumer.types'

const COLORS = ['#FF69B4', '#4169E1', '#9370DB']

const removeMayoria = (text: string) => text.replace('Mayoría', '').trim()

const normalizeGender = (gender: string) => {
  if (gender.toLowerCase().includes('femenino')) return 'Femenino'
  if (gender.toLowerCase().includes('masculino')) return 'Masculino'
  return 'Otro'
}

function groupAndSumByGender(data: GenderDistributionChartData[]) {
  const grouped: Record<string, number> = {}
  data.forEach((item) => {
    const normalized = normalizeGender(item.gender)
    grouped[normalized] = (grouped[normalized] || 0) + item.quantity
  })
  return Object.entries(grouped).map(([gender, quantity]) => ({
    gender,
    quantity,
    name: gender,
  }))
}

const CustomLegend = ({ data }: { data: GenderDistributionChartData[] }) => {
  return (
    <div className="flex justify-center gap-3 print:static">
      {data.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: COLORS[index % COLORS.length] }}
          />
          <span
            className="text-sm"
            style={{ color: COLORS[index % COLORS.length] }}
          >
            {removeMayoria(entry.gender)}
          </span>
        </div>
      ))}
    </div>
  )
}

/**
 * Componente que muestra un gráfico circular con la distribución de consumidores por género.
 *
 * @param {GenderDistributionChartData[]} props.data
 * @property {string} gender - Nombre del género (ej. "Hombre", "Mujer", "Otro")
 * @property {number} quantity - Cantidad de consumidores de este género
 */

export function GenderDistributionChart({
  data,
}: {
  data: GenderDistributionChartData[]
}) {
  const formattedData = groupAndSumByGender(data)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consumidores por género</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={formattedData}
              cx="50%"
              cy="40%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="quantity"
              nameKey="gender"
              className="font-semibold"
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              style={{ fontSize: '15px' }}
            >
              {formattedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }: TooltipProps<number, string>) => {
                if (active && payload && payload.length) {
                  const data = payload[0]
                    .payload as GenderDistributionChartData & { name: string }
                  const index = formattedData.findIndex(
                    (item) => item.gender === data.gender,
                  )
                  const color = COLORS[index % COLORS.length]

                  return (
                    <div className="bg-white p-3 border shadow-sm">
                      <p className="font-normal">
                        {removeMayoria(data.gender)}
                      </p>
                      <p style={{ color: color }}>{data.quantity} demos</p>
                    </div>
                  )
                }
                return null
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <CustomLegend data={formattedData} />
      </CardContent>
    </Card>
  )
}
