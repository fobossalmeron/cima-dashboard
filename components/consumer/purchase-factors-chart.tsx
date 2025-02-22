"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { factor: "Sabor", porcentaje: 48.1 },
  { factor: "Precio", porcentaje: 20.2 },
  { factor: "Ingredientes", porcentaje: 6.9 },
  { factor: "Imagen", porcentaje: 4.3 },
  { factor: "Otros", porcentaje: 2.6 },
];

export function PurchaseFactorsChart() {
  return (
    <Card>
      <CardHeader className="p-6">
        <CardTitle>Factores de decisión de compra</CardTitle>
        <CardDescription>
          Distribución porcentual de factores de compra
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="factor" style={{ fontSize: "12px" }} />
            <YAxis style={{ fontSize: "12px" }} />
            <Tooltip
              formatter={(value: number) => [`${value}%`, "Porcentaje"]}
            />
            <Bar
              dataKey="porcentaje"
              fill="hsl(217, 91%, 60%)"
              label={{
                position: "center",
                fill: "white",
                fontSize: 12,
                formatter: (value: number) => `${value}%`
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
