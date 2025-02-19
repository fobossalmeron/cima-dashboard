"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const data = [
  { name: "Hispano/Latino", value: 45 },
  { name: "Caucásico", value: 25 },
  { name: "Afroamericano", value: 15 },
  { name: "Asiático", value: 10 },
  { name: "Otro", value: 5 },
]

const COLORS = ["#FF8042", "#00C49F", "#FFBB28", "#0088FE", "#9370DB"]

export function EthnicityDistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución por etnia</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

