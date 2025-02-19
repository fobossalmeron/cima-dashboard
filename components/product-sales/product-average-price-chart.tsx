"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  {
    id: 1,
    producto: "Producto A",
    precio: 2.99,
    imagen: "/placeholder.svg",
  },
  {
    id: 2,
    producto: "Producto B",
    precio: 1.99,
    imagen: "/placeholder.svg",
  },
  {
    id: 3,
    producto: "Producto C",
    precio: 3.49,
    imagen: "/placeholder.svg",
  },
  {
    id: 4,
    producto: "Producto D",
    precio: 2.49,
    imagen: "/placeholder.svg",
  },
  {
    id: 5,
    producto: "Producto E",
    precio: 1.79,
    imagen: "/placeholder.svg",
  },
]

export function ProductAveragePriceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Precio promedio por producto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer>
            <BarChart data={data} layout="vertical" margin={{ left: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(value) => `$${value.toFixed(2)}`} />
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
              <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, "Precio promedio"]} />
              <Bar dataKey="precio" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

