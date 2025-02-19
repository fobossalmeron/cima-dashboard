"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { dia: "Lunes", ventas: 15200 },
  { dia: "Martes", ventas: 14800 },
  { dia: "Miércoles", ventas: 16500 },
  { dia: "Jueves", ventas: 17200 },
  { dia: "Viernes", ventas: 21500 },
  { dia: "Sábado", ventas: 24800 },
  { dia: "Domingo", ventas: 19900 },
]

export function SalesByDayChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas por día de la semana</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dia" />
            <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Ventas"]} />
            <Bar dataKey="ventas" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

