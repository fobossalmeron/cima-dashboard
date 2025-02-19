"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { factor: "Sabor", porcentaje: 85 },
  { factor: "Precio", porcentaje: 65 },
  { factor: "Ingredientes", porcentaje: 45 },
  { factor: "Imagen", porcentaje: 35 },
]

export function PurchaseFactorsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Factores de decisión de compra</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="factor" type="category" />
            <Tooltip />
            <Bar dataKey="porcentaje" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

