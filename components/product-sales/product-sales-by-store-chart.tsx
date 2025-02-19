"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  {
    tipo: "Supermercado",
    "Producto A": 5000,
    "Producto B": 4000,
    "Producto C": 3500,
    "Producto D": 3000,
    "Producto E": 2500,
  },
  {
    tipo: "Tienda de conveniencia",
    "Producto A": 3500,
    "Producto B": 2800,
    "Producto C": 2400,
    "Producto D": 2000,
    "Producto E": 1800,
  },
  {
    tipo: "Farmacia",
    "Producto A": 2500,
    "Producto B": 2000,
    "Producto C": 1800,
    "Producto D": 1500,
    "Producto E": 1200,
  },
  {
    tipo: "Gasolinera",
    "Producto A": 1500,
    "Producto B": 1000,
    "Producto C": 1200,
    "Producto D": 1100,
    "Producto E": 700,
  },
]

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#a4de6c"]

export function ProductSalesByStoreChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas por tipo de punto de venta</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tipo" />
              <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Ventas"]} />
              <Legend />
              {["Producto A", "Producto B", "Producto C", "Producto D", "Producto E"].map((product, index) => (
                <Bar key={product} dataKey={product} stackId="a" fill={COLORS[index]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

