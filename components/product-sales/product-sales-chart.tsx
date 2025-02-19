"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  {
    id: 1,
    producto: "Producto A",
    ventas: 12500,
    imagen: "/placeholder.svg",
  },
  {
    id: 2,
    producto: "Producto B",
    ventas: 9800,
    imagen: "/placeholder.svg",
  },
  {
    id: 3,
    producto: "Producto C",
    ventas: 8900,
    imagen: "/placeholder.svg",
  },
  {
    id: 4,
    producto: "Producto D",
    ventas: 7600,
    imagen: "/placeholder.svg",
  },
  {
    id: 5,
    producto: "Producto E",
    ventas: 6200,
    imagen: "/placeholder.svg",
  },
]

export function ProductSalesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas totales por producto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer>
            <BarChart data={data} layout="vertical" margin={{ left: 50 }}>
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
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Ventas"]} />
              <Bar dataKey="ventas" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

