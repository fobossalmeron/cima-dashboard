"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { mes: "Ene", ventas: 45000 },
  { mes: "Feb", ventas: 52000 },
  { mes: "Mar", ventas: 48000 },
  { mes: "Abr", ventas: 61000 },
  { mes: "May", ventas: 55000 },
  { mes: "Jun", ventas: 67000 },
  { mes: "Jul", ventas: 72000 },
  { mes: "Ago", ventas: 69000 },
  { mes: "Sep", ventas: 74000 },
  { mes: "Oct", ventas: 78000 },
  { mes: "Nov", ventas: 82000 },
  { mes: "Dic", ventas: 91000 },
]

export function TotalSalesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas totales por mes</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Ventas"]} />
            <Legend />
            <Line
              type="monotone"
              dataKey="ventas"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

