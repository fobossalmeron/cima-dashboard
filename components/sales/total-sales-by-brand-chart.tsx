"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

const data = [
  { tipo: "Del Frutal Aguas Frescas", ventas: 45000, unidades: 5100 },
  { tipo: "Del Frutal Néctares", ventas: 32000, unidades: 2600 },
  { tipo: "Del Frutal Pulpa", ventas: 28000, unidades: 4300 },
  { tipo: "Raptor Energy Drink", ventas: 15000, unidades: 1000 },
  { tipo: "Naturas Néctares", ventas: 12000, unidades: 1000 }, 
  { tipo: "Naturas Pulpa", ventas: 12000, unidades: 1000 }, 
]

// Array de colores que podemos usar para cualquier marca
const chartColors = [
  "#FF6B6B", // rojo coral
  "#4ECDC4", // turquesa
  "#45B7D1", // azul claro
  "#96CEB4", // verde menta
  "#FFEEAD", // amarillo pastel
  "#D4A5A5", // rosa antiguo
  "#9B786F", // marrón
  "#6C88C4", // azul acero
  "#FFB6B9", // rosa salmón
  "#8785A2"  // púrpura gris
]

export function TotalSalesByBrand() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas totales por submarca</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tipo" fontSize={12} />
            <YAxis 
              tickFormatter={(value) => `${value.toLocaleString()}`} 
              fontSize={12} 
            />
            <Tooltip 
              formatter={(value: number) => [`${value} unidades`]}
            />
            <Bar dataKey="unidades" fill="#000">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

