"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { tipo: "Supermercado", ventas: 45000 },
  { tipo: "Tienda de conveniencia", ventas: 32000 },
  { tipo: "Farmacia", ventas: 28000 },
  { tipo: "Gasolinera", ventas: 15000 },
]

export function SalesByStoreTypeChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas por tipo de punto de venta</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tipo" />
            <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Ventas"]} />
            <Bar dataKey="ventas" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

