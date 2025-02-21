'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AmbassadorMetrics {
  name: string;
  activations: number;
  totalSales: number;
  averageSales: number;
}

const data: AmbassadorMetrics[] = [
  { name: "Maria Gabriela Arteaga", activations: 18, totalSales: 473, averageSales: 26.28 },
  { name: "Stefee Paola Agudelo", activations: 37, totalSales: 1097, averageSales: 29.65 },
  { name: "Katherin Herrera", activations: 34, totalSales: 851, averageSales: 25.03 },
  { name: "Katheryne Torres", activations: 25, totalSales: 712, averageSales: 28.48 },
  { name: "Marcela Arias", activations: 16, totalSales: 488, averageSales: 30.50 },
  { name: "Angelica Kurbaje", activations: 16, totalSales: 437, averageSales: 27.31 },
  { name: "Cristal Urbaez", activations: 14, totalSales: 370, averageSales: 26.43 },
  { name: "Cristina Espejo", activations: 7, totalSales: 237, averageSales: 33.86 },
  { name: "Natalia Escarraga", activations: 6, totalSales: 192, averageSales: 32.00 },
  { name: "Sofia Jimenez", activations: 5, totalSales: 188, averageSales: 37.60 },
].sort((a, b) => b.averageSales - a.averageSales); // Ordenar por promedio de ventas

function formatName(fullName: string): string {
  const names = fullName.split(' ');
  return `${names[0][0]}. ${names[names.length - 1]}`;
}

export function ActivationsVsSalesChart() {
  const formattedData = data.map(item => ({
    ...item,
    name: formatName(item.name)
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Efectividad por embajadora</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedData}
              margin={{
                top: 10,
                right: 30,
                left: 10,
                bottom: 20
              }}
              barGap={0}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === "Promedio de ventas") {
                    return [`${Number(value).toFixed(2)} ventas/activación`, name];
                  }
                  return [value, name];
                }}
              />
              <Legend wrapperStyle={{ fontSize: 14, paddingTop: 5 }} />
              <Bar 
                yAxisId="left"
                dataKey="activations" 
                fill="#82ca9d" 
                name="Activaciones"
              />
              <Bar 
                yAxisId="right"
                dataKey="averageSales" 
                fill="#ffc658" 
                name="Promedio de ventas por activación"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 