"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { GenderDistributionChartData } from "./consumer.types";

const COLORS = ["#FF69B4", "#4169E1", "#9370DB"];

/**
 * Componente que muestra un gráfico circular con la distribución de consumidores por género.
 *
 * @param {Object} props
 * @param {GenderDistributionChartData[]} props.data - Datos para el gráfico de distribución por género
 * @property {string} gender - Nombre del género
 * @property {number} quantity - Cantidad de consumidores de este género
 */
export function GenderDistributionChart({
  data,
}: {
  data: GenderDistributionChartData[];
}) {
  const formattedData = data.map((item) => ({
    ...item,
    name: item.gender,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución por género</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={formattedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="quantity"
              nameKey="gender"
              label={({ gender, percent }) =>
                `${gender} ${(percent * 100).toFixed(0)}%`
              }
              style={{ fontSize: "12px" }}
            >
              {formattedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} personas`, "Cantidad"]} />
            <Legend wrapperStyle={{ fontSize: "14px" }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
