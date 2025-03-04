"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Label,
} from "recharts";
interface PDVTypeChartData {
  type: string;
  quantity: number;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82ca9d",
  "#ffc658",
  "#8dd1e1",
];

/**
 * Componente que muestra un gráfico circular con la distribución de tipos de puntos de venta.
 *
 * @param {PDVTypeChartData[]} props.data
 * @property {string} type - Nombre del tipo de punto de venta (ej. "Supermercado", "Tienda de conveniencia")
 * @property {number} quantity - Número de puntos de venta de este tipo
 */

export function PDVTypeChart({ data }: { data: PDVTypeChartData[] }) {
  const calculatedTotalPdv = data.reduce((sum, item) => sum + item.quantity, 0);

  // Función para calcular el porcentaje de cada tipo de PDV
  const calculatePercentage = (value: number): number => {
    if (calculatedTotalPdv === 0) return 0;
    return Math.round((value / calculatedTotalPdv) * 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tipo de punto de venta</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <div className="w-1/2">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                dataKey="quantity"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {calculatedTotalPdv}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            PDV
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
              <Tooltip
                formatter={(value: number) => [
                  `${value} (${calculatePercentage(value)}%)`,
                  "Cantidad",
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/2 items-center justify-center flex flex-col">
          {data.map((entry, index) => (
            <div key={entry.type} className="flex items-center mb-2">
              <div
                className="w-3 h-3 mr-2 rounded-sm"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm">
                {entry.type} ({entry.quantity} -{" "}
                {calculatePercentage(entry.quantity)}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
