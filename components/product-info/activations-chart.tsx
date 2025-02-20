"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from "recharts"

const data = [
  {
    name: "Enero",
    activaciones_tiendas_nuevas: 45,
    activaciones_tiendas_anteriores: 30,
    tiendas_nuevas: 15,
    tiendas_anteriores: 10
  },
  {
    name: "Febrero",
    activaciones_tiendas_nuevas: 60,
    activaciones_tiendas_anteriores: 40,
    tiendas_nuevas: 20,
    tiendas_anteriores: 15
  },
  {
    name: "Marzo",
    activaciones_tiendas_nuevas: 75,
    activaciones_tiendas_anteriores: 50,
    tiendas_nuevas: 25,
    tiendas_anteriores: 20
  },
  {
    name: "Abril",
    activaciones_tiendas_nuevas: 90,
    activaciones_tiendas_anteriores: 60,
    tiendas_nuevas: 30,
    tiendas_anteriores: 25
  },
  {
    name: "Mayo",
    activaciones_tiendas_nuevas: 105,
    activaciones_tiendas_anteriores: 70,
    tiendas_nuevas: 35,
    tiendas_anteriores: 30
  },
  {
    name: "Junio",
    activaciones_tiendas_nuevas: 120,
    activaciones_tiendas_anteriores: 80,
    tiendas_nuevas: 40,
    tiendas_anteriores: 35
  },
]

export function ActivationsChart() {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Activaciones y número de tiendas por tipo</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              style={{ fontSize: '12px' }}
            />
            <Tooltip />
            <Legend 
              wrapperStyle={{ 
                fontSize: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                paddingLeft: '10px',
                paddingRight: '10px',
              }}
            />
            <Bar 
              dataKey="activaciones_tiendas_nuevas" 
              name="Activaciones en Tiendas Nuevas" 
              fill="#0088FE"
            >
              <LabelList 
                dataKey="activaciones_tiendas_nuevas" 
                position="top" 
                style={{ fontSize: '11px' }}
              />
            </Bar>
            <Bar 
              dataKey="activaciones_tiendas_anteriores" 
              name="Activaciones en Tiendas Anteriores" 
              fill="#00C49F"
            >
              <LabelList 
                dataKey="activaciones_tiendas_anteriores" 
                position="top" 
                style={{ fontSize: '11px' }}
              />
            </Bar>
            <Bar 
              dataKey="tiendas_nuevas" 
              name="Tiendas Nuevas" 
              fill="#FFBB28"
            >
              <LabelList 
                dataKey="tiendas_nuevas" 
                position="top" 
                style={{ fontSize: '11px' }}
              />
            </Bar>
            <Bar 
              dataKey="tiendas_anteriores" 
              name="Tiendas Anteriores" 
              fill="#FF8042"
            >
              <LabelList 
                dataKey="tiendas_anteriores" 
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

