"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from "recharts"

// Colores para las barras
const COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", 
  "#FFD700", "#D4A5A5", "#9B59B6", "#3498DB", "#E67E22"
]

const data = [
  { name: "Del Frutal Aguas Frescas", precio: 1.99 },
  { name: "Del Frutal Pulpa 1L", precio: 2.99 },
  { name: "Del Frutal Lata", precio: 2.79 },
  { name: "Del Frutal Tetrapack", precio: 2.79 },
  { name: "Del Frutal 3 Pack", precio: 2.79 },
  { name: "Raptor Lata", precio: 0.99 },
  { name: "Raptor Botella", precio: 1.49 },
  { name: "Naturas Lata", precio: 2.59 },
  { name: "Naturas Tetrapack", precio: 2.59 },
  { name: "Naturas 3 Pack", precio: 2.59 },
  { name: "Naturas Pulpa 1L", precio: 2.59 },
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
            margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
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

