"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
  TooltipProps,
} from "recharts";
import { TrafficDuringActivationChartData } from "./sampling.types";

const REFERENCE = [
  { range: "Muy Bajo", detail: "0-24 personas", fill: "#FFBB28" },
  { range: "Bajo", detail: "25-35 personas", fill: "#00C49F" },
  { range: "Medio", detail: "36-50 personas", fill: "#0088FE" },
  { range: "Alto", detail: "51-60 personas", fill: "#FF8042" },
  { range: "Muy Alto", detail: "más de 60 personas", fill: "#8884d8" },
];

/**
 * Componente que muestra un gráfico de tráfico durante las activaciones de productos.
 *
 * @param {TrafficDuringActivationChartData[]} props.data
 * @property {Range} range - Rango de tráfico (ej. "Muy Bajo", "Bajo", etc.)
 * @property {number} value - Ocasiones que se registró este rango de tráfico
 */

export function TrafficDuringActivationChart({
  data,
}: {
  data: TrafficDuringActivationChartData[];
}) {
  // Enriquecemos los datos con la información de color desde REFERENCE
  const formattedData = data.map((item) => {
    const referenceItem = REFERENCE.find((ref) => ref.range === item.range);
    return {
      ...item,
      fill: referenceItem?.fill,
      detail: referenceItem?.detail,
      name: item.range,
    };
  });

  // Ordenamos los datos según el orden en REFERENCE
  const orderedData = [...formattedData].sort((a, b) => {
    const indexA = REFERENCE.findIndex((ref) => ref.range === a.range);
    const indexB = REFERENCE.findIndex((ref) => ref.range === b.range);
    return indexA - indexB;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tráfico durante samplings</CardTitle>
        <CardDescription>
          Cantidad de personas en punto de venta
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={orderedData}
              cx="50%"
              cy="40%"
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
              nameKey="range"
              labelLine={false}
              className="font-semibold"
              style={{
                fontSize: 15,
              }}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            >
              {orderedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }: TooltipProps<number, string>) => {
                if (active && payload && payload.length) {
                  const data = payload[0]
                    .payload as TrafficDuringActivationChartData & {
                    fill: string;
                    detail: string;
                  };

                  return (
                    <div className="bg-white p-3 border shadow-sm">
                      <p className="font-normal">{data.range}</p>
                      <p className="text-gray-600">({data.detail})</p>
                      <p style={{ color: data.fill }}>{data.value} ocasiones</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "14px" }}
              formatter={(value) => {
                const item = REFERENCE.find((ref) => ref.range === value);
                return <span style={{ color: item?.fill }}>{value}</span>;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
