"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  {
    name: "Ana García",
    sales: 2800,
    image: "/placeholder.svg",
  },
  {
    name: "María Rodríguez",
    sales: 2100,
    image: "/placeholder.svg",
  },
  {
    name: "Laura Martínez",
    sales: 2500,
    image: "/placeholder.svg",
  },
  {
    name: "Carmen López",
    sales: 1900,
    image: "/placeholder.svg",
  },
  {
    name: "Sofia Pérez",
    sales: 2300,
    image: "/placeholder.svg",
  },
]

export function AmbassadorSalesRanking() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ranking de ventas</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 50 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={(value) => `$${value.toLocaleString()}`} />
            <YAxis
              dataKey="name"
              type="category"
              width={100}
              tick={(props) => {
                const { x, y, payload } = props
                const ambassador = data.find((a) => a.name === payload.value)
                return (
                  <g transform={`translate(${x},${y})`}>
                    <image
                      x={-40}
                      y={-12}
                      width={24}
                      height={24}
                      xlinkHref={ambassador?.image}
                      style={{ borderRadius: "50%" }}
                    />
                    <text x={-10} y={4} textAnchor="start" fill="#666">
                      {payload.value}
                    </text>
                  </g>
                )
              }}
            />
            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Ventas"]} />
            <Bar dataKey="sales" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

