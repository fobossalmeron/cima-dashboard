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
  // Interfaz para las propiedades del tooltip personalizado
  interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
      payload: ProductStatusInPDVChartData;
      dataKey: string;
      name: string;
      color: string;
    }>;
  }

  // Componente de tooltip personalizado
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
            {currentData.quantity} ocasiones
          </p>
        </div>
      );
    }
    return null;
  };

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
              fontSize={15}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              className="font-semibold"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
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
