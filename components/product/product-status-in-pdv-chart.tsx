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
import { ProductStatusInPDVChartData } from "./product.types";

const COLORS = ["#00C49F", "#FF8042"];

/**
 * Componente que muestra un gráfico circular sobre el estado de promoción de productos.
 * Visualiza la distribución entre productos en promoción y a precio regular.
 *
 * @param {ProductStatusInPDVChartData[]} props.data
 * @property {string} type - El tipo de estado ("En promoción" o "Precio regular")
 * @property {number} quantity - La cantidad de productos en cada estado
 */
export function ProductStatusInPDVChart({
  data,
}: {
  data: ProductStatusInPDVChartData[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>¿Producto en promoción?</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="quantity"
              nameKey="type"
              fontSize={14}
              label={({ type, percent }) =>
                `${type} ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${value}`, `${name}`]} />
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
