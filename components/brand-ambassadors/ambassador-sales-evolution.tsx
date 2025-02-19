"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { mes: "Ene", "Ana García": 2100, "María Rodríguez": 1800, "Laura Martínez": 1900 },
  { mes: "Feb", "Ana García": 2300, "María Rodríguez": 1900, "Laura Martínez": 2100 },
  { mes: "Mar", "Ana García": 2200, "María Rodríguez": 2000, "Laura Martínez": 2000 },
  { mes: "Abr", "Ana García": 2600, "María Rodríguez": 2200, "Laura Martínez": 2300 },
  { mes: "May", "Ana García": 2400, "María Rodríguez": 2100, "Laura Martínez": 2200 },
  { mes: "Jun", "Ana García": 2800, "María Rodríguez": 2100, "Laura Martínez": 2500 },
]

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"]

export function AmbassadorSalesEvolution() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolución de ventas por embajadora</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Ventas"]} />
            <Legend />
            {["Ana García", "María Rodríguez", "Laura Martínez"].map((ambassador, index) => (
              <Line
                key={ambassador}
                type="monotone"
                dataKey={ambassador}
                stroke={COLORS[index]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

