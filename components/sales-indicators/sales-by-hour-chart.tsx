"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { hora: "6:00", ventas: 500 },
  { hora: "7:00", ventas: 800 },
  { hora: "8:00", ventas: 1200 },
  { hora: "9:00", ventas: 1500 },
  { hora: "10:00", ventas: 1800 },
  { hora: "11:00", ventas: 2200 },
  { hora: "12:00", ventas: 2500 },
  { hora: "13:00", ventas: 2800 },
  { hora: "14:00", ventas: 2400 },
  { hora: "15:00", ventas: 2100 },
  { hora: "16:00", ventas: 1900 },
  { hora: "17:00", ventas: 2000 },
  { hora: "18:00", ventas: 2300 },
  { hora: "19:00", ventas: 2100 },
  { hora: "20:00", ventas: 1800 },
  { hora: "21:00", ventas: 1500 },
  { hora: "22:00", ventas: 1200 },
]

export function SalesByHourChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas por hora del día</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hora" />
            <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Ventas"]} />
            <Line type="monotone" dataKey="ventas" stroke="#82ca9d" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

