"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  {
    id: 1,
    producto: "Producto A",
    ventas: 12500,
    objetivo: 13000,
    cumplimiento: 96,
    imagen: "/placeholder.svg",
  },
  {
    id: 2,
    producto: "Producto B",
    ventas: 9800,
    objetivo: 9000,
    cumplimiento: 109,
    imagen: "/placeholder.svg",
  },
  {
    id: 3,
    producto: "Producto C",
    ventas: 8900,
    objetivo: 10000,
    cumplimiento: 89,
    imagen: "/placeholder.svg",
  },
  {
    id: 4,
    producto: "Producto D",
    ventas: 7600,
    objetivo: 7000,
    cumplimiento: 109,
    imagen: "/placeholder.svg",
  },
  {
    id: 5,
    producto: "Producto E",
    ventas: 6200,
    objetivo: 6500,
    cumplimiento: 95,
    imagen: "/placeholder.svg",
  },
]

export function ProductSalesVsTargetChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas vs Objetivo por producto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer>
            <ComposedChart data={data} layout="vertical" margin={{ left: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(value) => `$${value.toLocaleString()}`} />
              <YAxis
                dataKey="producto"
                type="category"
                width={100}
                tick={(props) => {
                  const { x, y, payload } = props
                  const product = data.find((p) => p.producto === payload.value)
                  return (
                    <g transform={`translate(${x},${y})`}>
                      <image
                        x={-40}
                        y={-12}
                        width={24}
                        height={24}
                        xlinkHref={product?.imagen}
                        style={{ borderRadius: "50%" }}
                      />
                      <text x={-10} y={4} textAnchor="start" fill="#666">
                        {payload.value}
                      </text>
                    </g>
                  )
                }}
              />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "cumplimiento") return [`${value}%`, "Cumplimiento"]
                  return [`$${value.toLocaleString()}`, name === "ventas" ? "Ventas" : "Objetivo"]
                }}
              />
              <Legend />
              <Bar dataKey="ventas" fill="#8884d8" name="Ventas" />
              <Line dataKey="objetivo" stroke="#ff7300" strokeWidth={2} name="Objetivo" />
              <Line dataKey="cumplimiento" stroke="#82ca9d" strokeWidth={2} name="Cumplimiento %" yAxisId="right" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

