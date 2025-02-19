"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { nombre: "Tienda A", ventas: 28500 },
  { nombre: "Tienda B", ventas: 25600 },
  { nombre: "Tienda C", ventas: 24200 },
  { nombre: "Tienda D", ventas: 22800 },
  { nombre: "Tienda E", ventas: 21500 },
  { nombre: "Tienda F", ventas: 20100 },
  { nombre: "Tienda G", ventas: 19400 },
  { nombre: "Tienda H", ventas: 18900 },
  { nombre: "Tienda I", ventas: 18200 },
  { nombre: "Tienda J", ventas: 17500 },
]

export function TopStoresChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 puntos de venta</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={(value) => `$${value.toLocaleString()}`} />
            <YAxis dataKey="nombre" type="category" width={80} />
            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Ventas"]} />
            <Bar dataKey="ventas" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

