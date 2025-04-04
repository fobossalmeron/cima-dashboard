"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
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
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={formattedData}
              cx="50%"
              cy="40%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="quantity"
              nameKey="ethnicity"
              className="font-semibold"
              style={{
                fontSize: 15,
              }}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
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
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center gap-3 gap-y-1">
          {formattedData.map((entry, index) => (
            <div
              key={`legend-${index}`}
              className="flex items-center gap-2"
              style={{
                breakInside: "avoid",
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span
                className="text-sm"
                style={{ color: COLORS[index % COLORS.length] }}
              >
                {entry.ethnicity}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
