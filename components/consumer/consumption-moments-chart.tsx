"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { momento: "Casa", cantidad: 1200 },
  { momento: "Trabajo", cantidad: 750 },
  { momento: "Reuniones sociales", cantidad: 600 },
  { momento: "Estudio", cantidad: 450 },
]

export function ConsumptionMomentsChart() {
  // Calcular el total
  const total = data.reduce((sum, item) => sum + item.cantidad, 0);

  // Crear nuevo array con porcentajes
  const dataWithPercentages = data.map((item) => ({
    ...item,
    porcentaje: ((item.cantidad / total) * 100).toFixed(1),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Momentos de consumo</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataWithPercentages} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" style={{ fontSize: '12px' }} />
            <YAxis dataKey="momento" type="category" style={{ fontSize: '12px' }} />
            <Tooltip formatter={(value: number) => [`${value} personas`]} />
            <Bar 
              dataKey="cantidad" 
              fill="#8884d8"
              label={{
                position: "center",
                fill: "white",
                fontSize: 12,
                formatter: (value: number) => `${((value / total) * 100).toFixed(1)}%`,
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
