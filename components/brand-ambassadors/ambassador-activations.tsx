"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  {
    name: "Ana García",
    activations: 25,
    image: "/placeholder.svg",
  },
  {
    name: "María Rodríguez",
    activations: 18,
    image: "/placeholder.svg",
  },
  {
    name: "Laura Martínez",
    activations: 22,
    image: "/placeholder.svg",
  },
  {
    name: "Carmen López",
    activations: 15,
    image: "/placeholder.svg",
  },
  {
    name: "Sofia Pérez",
    activations: 20,
    image: "/placeholder.svg",
  },
]

export function AmbassadorActivations() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activaciones por embajadora</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 50 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
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
            <Tooltip />
            <Bar dataKey="activations" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

