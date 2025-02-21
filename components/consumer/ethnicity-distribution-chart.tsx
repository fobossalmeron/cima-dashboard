"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const data = [
  { name: "Afroamericanos", value: 30 },
  { name: "Hispanos", value: 40 },
  { name: "Americanos", value: 20 },
  { name: "Otro", value: 10 },
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
              style={{
                fontSize: 12,
              }}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '14px' }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

