"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  TooltipProps,
} from "recharts";
import { GenderDistributionChartData } from "./consumer.types";

const COLORS = ["#FF69B4", "#4169E1", "#9370DB"];

/**
 * Componente que muestra un gráfico circular con la distribución de consumidores por género.
 *
 * @param {GenderDistributionChartData[]} props.data
 * @property {string} gender - Nombre del género (ej. "Hombre", "Mujer", "Otro")
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
              className="font-semibold"
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              style={{ fontSize: "15px" }}
            >
              {formattedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }: TooltipProps<number, string>) => {
                if (active && payload && payload.length) {
                  const data = payload[0]
                    .payload as GenderDistributionChartData & { name: string };
                  const index = formattedData.findIndex(
                    (item) => item.gender === data.gender
                  );
                  const color = COLORS[index % COLORS.length];

                  return (
                    <div className="bg-white p-3 border shadow-sm">
                      <p className="font-normal">{data.gender}</p>
                      <p style={{ color: color }}>{data.quantity} personas</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend wrapperStyle={{ fontSize: "14px" }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
