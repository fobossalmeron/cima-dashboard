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
  Legend,
} from "recharts";
import { PDVTypeChartData } from "./product.types";

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

  // Personalización del tooltip
  interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
      payload: PDVTypeChartData;
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
        (item) => item.type === currentData.type
      );
      const colorIndex = dataIndex >= 0 ? dataIndex % COLORS.length : 0;
      const color = COLORS[colorIndex];

      return (
        <div className="bg-background border border-border p-3">
          <p className="text-base">{currentData.type}</p>
          <p className="text-base" style={{ color: color }}>
            {currentData.quantity} puntos de venta
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tipo de punto de venta</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey="quantity"
              nameKey="type"
              labelLine={false}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              className="font-semibold"
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
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ fontSize: "14px", paddingTop: "20px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
