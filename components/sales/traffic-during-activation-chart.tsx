"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Medio (36-50 personas)", value: 37, fill: "#0088FE" },
  { name: "Bajo (25-35 personas)", value: 18, fill: "#00C49F" },
  { name: "Muy Bajo (0-24 personas)", value: 8, fill: "#FFBB28" },
  { name: "Alto (51-60 personas)", value: 23, fill: "#FF8042" },
  { name: "Muy Alto (más de 60 personas)", value: 14, fill: "#FF8042" },
];

export function TrafficDuringActivationChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tráfico durante activaciones</CardTitle>
        <CardDescription>
          Cantidad de personas en punto de venta
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <div className="w-1/2">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/2 items-center justify-center flex flex-col">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center mb-2">
              <div
                className="w-3 h-3 mr-2 rounded-sm"
                style={{ backgroundColor: entry.fill }}
              />
              <span className="text-sm">
                {entry.name} ({entry.value}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
