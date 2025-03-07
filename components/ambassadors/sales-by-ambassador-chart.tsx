"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Ambassador } from "./ambassadors.types";
import { formatName } from "./ambassadors-utils";

const COLORS = [
  "#FF4D4D",
  "#00C2B8",
  "#00A8CC",
  "#6BCB77",
  "#FFD966",
  "#D98880",
  "#A569BD",
  "#E59866",
  "#48C9B0",
  "#2980B9",
  "#8E44AD",
  "#C39BD3",
];

/**
 * Componente que muestra un gráfico de torta con el porcentaje de ventas por cada embajadora.
 * @param {Ambassador[]} data
 * @property {string} name - Nombre de la embajadora.
 * @property {number} totalSales - Total de ventas.
 */

export function SalesByAmbassadorChart({ data }: { data: Ambassador[] }) {
  // Calcular el total de ventas una sola vez
  const totalSales = data.reduce((sum, item) => sum + item.totalSales, 0);

  // Personalización del tooltip
  interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
      payload: Ambassador;
      dataKey: string;
      name: string;
      color: string;
    }>;
  }

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const currentData = payload[0].payload;

      // Encontrar el índice del elemento en el array de datos
      const dataIndex = data.findIndex(
        (item) => item.name === currentData.name
      );
      const colorIndex = dataIndex >= 0 ? dataIndex % COLORS.length : 0;
      const color = COLORS[colorIndex];

      const percent = ((currentData.totalSales / totalSales) * 100).toFixed(1);

      return (
        <div className="bg-background border border-border p-3">
          <p className="text-base">{currentData.name}</p>
          <p className="text-base" style={{ color: color }}>
            Ventas totales: {currentData.totalSales}
          </p>
          <p className="text-base" style={{ color: color }}>
            Porcentaje del total: {percent}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Distribución de ventas por embajadora</CardTitle>
        <CardDescription>
          Porcentaje de ventas por cada embajadora.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${formatName(name)} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={150}
                fill="#8884d8"
                dataKey="totalSales"
                fontSize={12}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
