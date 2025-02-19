"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "Ene", activaciones: 34, promedio: 194, ventas: 6596 },
  { name: "Feb", activaciones: 27, promedio: 631, ventas: 9657 },
  { name: "Mar", activaciones: 15, promedio: 608, ventas: 5200 },
  { name: "Abr", activaciones: 37, promedio: 236, ventas: 8732 },
  { name: "May", activaciones: 29, promedio: 141, ventas: 4089 },
  { name: "Jun", activaciones: 27, promedio: 193, ventas: 5211 },
]

export function ActivationSalesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolución de ventas y activaciones</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="ventas" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line yAxisId="left" type="monotone" dataKey="promedio" stroke="#82ca9d" />
            <Line yAxisId="right" type="monotone" dataKey="activaciones" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

