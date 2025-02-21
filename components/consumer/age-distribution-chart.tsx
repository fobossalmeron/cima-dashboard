"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { range: "18-24", cantidad: 150 },
  { range: "25-34", cantidad: 300 },
  { range: "35-44", cantidad: 250 },
  { range: "45-54", cantidad: 200 },
  { range: "55-64", cantidad: 100 },
  { range: "65+", cantidad: 50 },
];

export function AgeDistributionChart() {
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
        <CardTitle>Distribución por edad</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={dataWithPercentages}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" style={{ fontSize: "12px" }} />
            <YAxis dataKey="cantidad" style={{ fontSize: "12px" }} />
            <Tooltip 
              formatter={(value: number) => [`${value} personas`]}
            />
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
  );
}
