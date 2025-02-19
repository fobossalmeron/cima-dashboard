"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { mes: "Ene", ventas: 45000, objetivo: 50000, cumplimiento: 90 },
  { mes: "Feb", ventas: 52000, objetivo: 50000, cumplimiento: 104 },
  { mes: "Mar", ventas: 48000, objetivo: 55000, cumplimiento: 87 },
  { mes: "Abr", ventas: 61000, objetivo: 55000, cumplimiento: 111 },
  { mes: "May", ventas: 55000, objetivo: 60000, cumplimiento: 92 },
  { mes: "Jun", ventas: 67000, objetivo: 60000, cumplimiento: 112 },
]

export function SalesVsTargetChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas vs Objetivo</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis yAxisId="left" tickFormatter={(value) => `$${value.toLocaleString()}`} />
            <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} />
            <Tooltip
              formatter={(value, name) => {
                if (name === "cumplimiento") return [`${value}%`, "Cumplimiento"]
                return [`$${value.toLocaleString()}`, name === "ventas" ? "Ventas" : "Objetivo"]
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="ventas" fill="#8884d8" name="Ventas" />
            <Line yAxisId="left" type="monotone" dataKey="objetivo" stroke="#ff7300" strokeWidth={2} name="Objetivo" />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cumplimiento"
              stroke="#82ca9d"
              strokeWidth={2}
              name="Cumplimiento"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

