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
import { EthnicityDistributionChartData } from "./consumer.types";

const COLORS = ["#FF8042", "#00C49F", "#FFBB28", "#0088FE", "#9370DB"];

/**
 * Componente que muestra un gráfico circular con la distribución de consumidores por etnia.
 *
 * @param {EthnicityDistributionChartData[]} props.data
 * @property {string} ethnicity - Nombre de la etnia (ej. "Hispana", "Americana", "Afroamericana", etc.)
 * @property {number} quantity - Cantidad de consumidores de esta etnia
 */
export function EthnicityDistributionChart({
  data,
}: {
  data: EthnicityDistributionChartData[];
}) {
  const formattedData = data.map((item) => ({
    ...item,
    name: item.ethnicity,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución por etnia</CardTitle>
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
              nameKey="ethnicity"
              style={{
                fontSize: 12,
              }}
              label={({ ethnicity, percent }) =>
                `${ethnicity} ${(percent * 100).toFixed(0)}%`
              }
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
                    .payload as EthnicityDistributionChartData & {
                    name: string;
                  };
                  const index = formattedData.findIndex(
                    (item) => item.ethnicity === data.ethnicity
                  );
                  const color = COLORS[index % COLORS.length];

                  return (
                    <div className="bg-white p-3 border shadow-sm">
                      <p className="font-normal">{data.ethnicity}</p>
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
