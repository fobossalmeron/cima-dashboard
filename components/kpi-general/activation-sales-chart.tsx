"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "Ene", activaciones: 34, promedio: 194, ventas: 6596 },
  { name: "Feb", activaciones: 27, promedio: 631, ventas: 9657 },
  { name: "Mar", activaciones: 15, promedio: 608, ventas: 5200 },
  { name: "Abr", activaciones: 37, promedio: 236, ventas: 8732 },
  { name: "May", activaciones: 29, promedio: 141, ventas: 4089 },
  { name: "Jun", activaciones: 27, promedio: 193, ventas: 5211 },
]

export function ActivationSalesChart() {
  const maxValue = Math.max(...data.map(item => item.ventas));
  const minValue = 40;
  
  const generateLogTicks = (min: number, max: number) => {
    const ticks: number[] = [];
    let current = min;
    
    while (current <= max) {
      // Redondeamos al múltiplo de 25 más cercano
      const roundedValue = Math.round(current / 25) * 25;
      ticks.push(roundedValue);
      
      if (current < 100) current *= 2.5;
      else if (current < 1000) current *= 2.5;
      else current *= 2.5;
    }
    
    // Aseguramos que el último tick sea el valor máximo redondeado a miles
    const roundedMax = Math.ceil(max / 1000) * 1000;
    if (ticks[ticks.length - 1] !== roundedMax) {
      ticks.push(roundedMax);
    }
    
    // Eliminamos duplicados que puedan surgir del redondeo
    return [...new Set(ticks)];
  };

  const ticks = generateLogTicks(minValue, maxValue);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolución de ventas y activaciones</CardTitle>
        <CardDescription>Se muestra en escala logarítmica</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              horizontal={true}
            />
            <XAxis dataKey="name" />
            <YAxis 
              yAxisId="left" 
              scale="log"
              domain={[minValue, ticks[ticks.length - 1]]}
              ticks={ticks}
            />
            <Tooltip />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="activaciones" 
              name="No. activaciones"
              stroke="#ffc658"
              label={{ 
                position: 'top',
                fill: '#ffc658',
                fontSize: 12
              }}
            />
            <Line 
              yAxisId="left" 
              type="monotone" 
              dataKey="ventas" 
              name="Ventas totales"
              stroke="#8884d8" 
              label={{ 
                position: 'bottom',
                fill: '#8884d8',
                fontSize: 12
              }}
            />
            <Line 
              yAxisId="left" 
              type="monotone" 
              dataKey="promedio" 
              name="Promedio de ventas"
              stroke="#82ca9d"
              label={{ 
                position: 'top',
                fill: '#82ca9d',
                fontSize: 12
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

