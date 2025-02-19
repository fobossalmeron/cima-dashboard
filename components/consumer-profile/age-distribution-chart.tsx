"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { range: "18-24", cantidad: 150 },
  { range: "25-34", cantidad: 300 },
  { range: "35-44", cantidad: 250 },
  { range: "45-54", cantidad: 200 },
  { range: "55-64", cantidad: 100 },
  { range: "65+", cantidad: 50 },
]

export function AgeDistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución por edad</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

