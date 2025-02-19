"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { momento: "En casa", porcentaje: 40 },
  { momento: "En el trabajo", porcentaje: 25 },
  { momento: "Reuniones sociales", porcentaje: 20 },
  { momento: "Jornada de estudio", porcentaje: 15 },
]

export function ConsumptionMomentsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Momentos de consumo</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="momento" type="category" />
            <Tooltip />
            <Bar dataKey="porcentaje" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

