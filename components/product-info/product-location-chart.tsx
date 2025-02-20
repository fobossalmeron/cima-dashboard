"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const data = [
  { name: "Estantes", cantidad: 40 },
  { name: "Neveras", cantidad: 30 },
  { name: "Display Marca", cantidad: 20 },
  { name: "Display Tienda", cantidad: 10 },
];

export function ProductLocationChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ubicación del producto en punto de venta</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            barGap={0}
            barCategoryGap={10}
            margin={{ left: 0, right: 0, top: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              className="text-xs"
              interval={0}
              tickFormatter={(value) => value.slice(0, 10)}
            />
            <YAxis className="text-xs" />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#8884d8">
              <LabelList dataKey="cantidad" position="center" fill="#FFFFFF" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
