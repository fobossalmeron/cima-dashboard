"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";
import { AveragePriceInPDVChartData } from "./product.types";

// Colores para las barras
const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFD700",
  "#D4A5A5",
  "#9B59B6",
  "#3498DB",
  "#E67E22",
];

/**
 * Componente que muestra un gráfico de barras con el precio promedio de un producto en diferentes puntos de venta.
 *
 * @param {{data: AveragePriceInPDVChartData[]}} props
 * @property {AveragePriceInPDVChartData[]} data - Datos del gráfico
 * @property {string} brand - Nombre de marca y presentación, no de sabores. Ejemplo: "Del Frutal Lata"
 * @property {number} averagePrice - Precio promedio del producto
 **/

export function AveragePriceInPDVChart({
  data,
}: {
  data: AveragePriceInPDVChartData[];
}) {
  const sortedData = data.sort((a, b) => b.averagePrice - a.averagePrice);
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Precio promedio del producto en punto de venta</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
          >
            <XAxis type="number" domain={[0, "dataMax + 0.5"]} hide={true} />
            <YAxis
              type="category"
              dataKey="brand"
              width={150}
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Bar dataKey="averagePrice" minPointSize={2}>
              <LabelList
                dataKey="averagePrice"
                position="right"
                formatter={(value: number) => `$${value}`}
                style={{ fontSize: "10px" }}
              />
              {sortedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
