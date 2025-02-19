"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Producto A", precio: 2.99 },
  { name: "Producto B", precio: 1.99 },
  { name: "Producto C", precio: 3.49 },
  { name: "Producto D", precio: 2.49 },
]

export function AveragePriceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Precio promedio por tipo de producto</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="precio" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

