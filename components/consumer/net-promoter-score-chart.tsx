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
import { Badge } from '@/components/ui/badge'
import { NetPromoterScoreChartData } from './consumer.types'
import { getRealNetPromoterScores } from '@/lib/utils/dashboard-data/consumer'

// Color de la barra según la puntuación del NPS
const getBarColor = (vote: number): string => {
  if (vote >= 9) {
    return 'hsl(142, 76%, 36%)' // Verde para promotores (9-10)
  } else if (vote >= 7) {
    return 'hsl(38, 92%, 50%)' // Amarillo para pasivos (7-8)
  } else {
    return 'hsl(0, 84%, 60%)' // Rojo para detractores (0-6)
  }
}

// Datos para la leyenda del gráfico
const legendItems = [
  { value: 'Promotores', color: 'hsl(142, 76%, 36%)' },
  { value: 'Pasivos', color: 'hsl(38, 92%, 50%)' },
  { value: 'Detractores', color: 'hsl(0, 84%, 60%)' },
]

/**
 * Componente que muestra un gráfico de barras con la distribución de puntuaciones NPS (Net Promoter Score).
 * Calcula automáticamente los porcentajes de promotores, pasivos y detractores, así como el valor NPS final.
 *
 * @param {NetPromoterScoreChartData[]} props.data
 * @property {number} vote - Puntuación dada por el consumidor (0-10)
 * @property {number} quantity - Cantidad de consumidores que dieron esa puntuación
 */

export function NetPromoterScoreChart({
  data,
}: {
  data: NetPromoterScoreChartData[]
}) {
  const {
    realNps,
    dataWithPercentages,
    porcentajePromotores,
    porcentajePasivos,
    porcentajeDetractores,
  } = getRealNetPromoterScores(data)

  return (
    <Card>
      <CardHeader className="p-6">
        <CardTitle className="flex items-center gap-2">
          Net Promoter Score{' '}
          <Badge
            className={`rounded-sm text-white font-medium text-sm ${
              realNps < 0
                ? 'bg-[hsl(0,84%,60%)]'
                : realNps >= 0 && realNps < 30
                ? 'bg-[hsl(38,92%,50%)]'
                : 'bg-[hsl(142,76%,36%)]'
            }`}
          >
            {realNps.toFixed(0)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={dataWithPercentages}
            margin={{ top: 20, right: 0, bottom: 0, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="vote"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => value.toString()}
            />
            <YAxis
              style={{ fontSize: '12px' }}
              domain={[0, 'dataMax']}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const entry = dataWithPercentages.find(
                    (item) => item.vote === label,
                  )
                  return (
                    <div className="bg-white p-3 border shadow-sm">
                      <p>Calificación: {entry?.vote}</p>
                      <p>Votos: {entry?.quantity.toLocaleString()}</p>
                      <p>Porcentaje: {entry?.porcentaje}%</p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="quantity" name="Votos">
              {dataWithPercentages.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.vote)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex justify-center items-center gap-2 mt-4 text-sm">
          <div className="flex items-center">
            <span
              className="inline-block min-w-[14px] w-[14px] h-[14px] rounded-full mr-2"
              style={{ backgroundColor: legendItems[0].color }}
            />
            <span style={{ color: legendItems[0].color }}>
              {`${legendItems[0].value} (${porcentajePromotores.toFixed(0)}%)`}
            </span>
          </div>
          <div className="flex items-center">
            <span
              className="inline-block min-w-[14px] w-[14px] h-[14px] rounded-full mr-2"
              style={{ backgroundColor: legendItems[1].color }}
            />
            <span style={{ color: legendItems[1].color }}>
              {`${legendItems[1].value} (${porcentajePasivos.toFixed(0)}%)`}
            </span>
          </div>
          <div className="flex items-center">
            <span
              className="inline-block min-w-[14px] w-[14px] h-[14px] rounded-full mr-2"
              style={{ backgroundColor: legendItems[2].color }}
            />
            <span style={{ color: legendItems[2].color }}>
              {`${legendItems[2].value} (${porcentajeDetractores.toFixed(0)}%)`}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
