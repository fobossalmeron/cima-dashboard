"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "Ene", nuevas: 15, anteriores: 10 },
  { name: "Feb", nuevas: 20, anteriores: 15 },
  { name: "Mar", nuevas: 18, anteriores: 22 },
  { name: "Abr", nuevas: 25, anteriores: 20 },
  { name: "May", nuevas: 22, anteriores: 18 },
  { name: "Jun", nuevas: 30, anteriores: 25 },
]

export function ActivationsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activaciones nuevas vs anteriores</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="nuevas" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="anteriores" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

