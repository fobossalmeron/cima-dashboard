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
import { AgeDistributionChartData } from "./consumer.types";

/**
 * Componente que muestra un gráfico de barras con la distribución de consumidores por rango de edad.
 *
 * @param {AgeDistributionChartData[]} props.data
 * @property {string} ageRange - Rango de edad (ej. "18-24", "25-34", "35-44", etc.)
 * @property {number} quantity - Cantidad de consumidores en este rango de edad
 */

export function AgeDistributionChart({
  data,
}: {
  data: AgeDistributionChartData[];
}) {
  const total = data.reduce((sum, item) => sum + item.quantity, 0);

  const dataWithPercentages = data.map((item) => ({
    ...item,
    percentage: ((item.quantity / total) * 100).toFixed(1),
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
            <XAxis dataKey="ageRange" style={{ fontSize: "12px" }} />
            <YAxis dataKey="quantity" style={{ fontSize: "12px" }} />
            <Tooltip formatter={(value: number) => [`${value} personas`]} />
            <Bar
              dataKey="quantity"
              fill="#8884d8"
              className="font-semibold"
              label={{
                position: "center",
                fill: "white",
                fontSize: 12,
                formatter: (value: number) =>
                  `${((value / total) * 100).toFixed(1)}%`,
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
