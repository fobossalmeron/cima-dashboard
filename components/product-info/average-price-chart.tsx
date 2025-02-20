"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from "recharts"

// Colores para las barras
const COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", 
  "#FFD700", "#D4A5A5", "#9B59B6", "#3498DB", "#E67E22"
]

const data = [
  { name: "Aguas Frescas", precio: 1.99 },
  { name: "Incaparina", precio: 2.49 },
  { name: "Señorial Snacks", precio: 1.79 },
  { name: "Raptor Lata", precio: 0.99 },
  { name: "Raptor Botella", precio: 1.49 },
  { name: "Del Frutal Orange with Pulp", precio: 2.99 },
  { name: "Del Frutal Néctares", precio: 2.79 },
  { name: "Naturas Néctares", precio: 2.59 },
  { name: "Del Frutal Orange Tetratop", precio: 3.49 }
].sort((a, b) => b.precio - a.precio) // Ordenar por precio descendente

export function AveragePriceChart() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Precio promedio del producto en punto de venta</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
          >
            <XAxis 
              type="number" 
              domain={[0, 'dataMax + 0.5']} 
              hide={true}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={150}
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Bar dataKey="precio" minPointSize={2}>
              <LabelList 
                dataKey="precio" 
                position="right"
                formatter={(value: number) => `$${value}`}
                style={{ fontSize: '10px' }}
              />
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

