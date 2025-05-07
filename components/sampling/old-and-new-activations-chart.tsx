'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts'
import { OldAndNewActivationsChartData } from '../product/product.types'

/**
 * Componente que muestra un gráfico de barras comparando activaciones en tiendas nuevas y anteriores.
 * Visualiza datos de los *6 últimos meses* del rango de fechas seleccionado.
 *
 * @param {OldAndNewActivationsChart[]} props.data
 * @property {string} month - El mes de los datos (máximo 6 meses)
 * @property {number} new_location_activations - Número de activaciones en tiendas nuevas
 * @property {number} previous_location_activations - Número de activaciones en tiendas anteriores
 * @property {number} new_locations - Número de tiendas nuevas
 * @property {number} previous_locations - Número de tiendas anteriores
 */
export function OldAndNewActivationsChart({
  data,
}: {
  data: OldAndNewActivationsChartData[]
}) {
  const totalNewLocations = data.reduce(
    (sum, item) => sum + item.new_locations,
    0,
  )

  const MONTHS = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ]

  // Ordena los datos según el orden de los meses
  function sortByMonth(
    a: OldAndNewActivationsChartData,
    b: OldAndNewActivationsChartData,
  ) {
    const aIndex = MONTHS.indexOf(a.month.toLowerCase())
    const bIndex = MONTHS.indexOf(b.month.toLowerCase())
    return aIndex - bIndex
  }

  const sortedData = [...data].sort(sortByMonth)

  return (
    <Card className="md:col-span-2 print:col-span-2">
      <CardHeader className="flex flex-row items-start justify-between">
        <CardTitle>Tiendas nuevas y anteriores por mes</CardTitle>
        <div className="flex items-center gap-2 rounded-lg bg-[#0088FE]/10 px-4 py-2">
          <span className="text-sm font-medium text-[#0088FE]">
            Acumulado tiendas nuevas:
          </span>
          <span className="text-lg font-bold text-[#0088FE]">
            {totalNewLocations}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sortedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" style={{ fontSize: '12px' }} />
            <YAxis style={{ fontSize: '12px' }} />
            <Tooltip />
            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              wrapperStyle={{
                fontSize: '14px',
                width: '100%',
                paddingLeft: 0,
                paddingRight: 0,
                marginTop: 16,
              }}
              iconType="circle"
              iconSize={12}
            />
            <Bar dataKey="new_locations" name="Tiendas nuevas" fill="#0088FE">
              <LabelList
                dataKey="new_locations"
                position="top"
                style={{ fontSize: '11px' }}
              />
            </Bar>
            <Bar
              dataKey="previous_locations"
              name="Tiendas anteriores"
              fill="#FF8042"
            >
              <LabelList
                dataKey="previous_locations"
                position="top"
                style={{ fontSize: '11px' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
