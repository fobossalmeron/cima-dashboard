"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { mes: "Ene", "Producto A": 2500, "Producto B": 1800, "Producto C": 1500, "Producto D": 1200, "Producto E": 1000 },
  { mes: "Feb", "Producto A": 2800, "Producto B": 2000, "Producto C": 1700, "Producto D": 1400, "Producto E": 1100 },
  { mes: "Mar", "Producto A": 2600, "Producto B": 1900, "Producto C": 1600, "Producto D": 1300, "Producto E": 900 },
  { mes: "Abr", "Producto A": 3000, "Producto B": 2200, "Producto C": 1900, "Producto D": 1600, "Producto E": 1300 },
  { mes: "May", "Producto A": 2900, "Producto B": 2100, "Producto C": 1800, "Producto D": 1500, "Producto E": 1200 },
  { mes: "Jun", "Producto A": 3200, "Producto B": 2400, "Producto C": 2100, "Producto D": 1800, "Producto E": 1500 },
]

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#a4de6c"]

export function ProductSalesEvolutionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolución de ventas por producto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Ventas"]} />
              <Legend />
              {["Producto A", "Producto B", "Producto C", "Producto D", "Producto E"].map((product, index) => (
                <Line
                  key={product}
                  type="monotone"
                  dataKey={product}
                  stroke={COLORS[index]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

