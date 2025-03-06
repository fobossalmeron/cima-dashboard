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
import { useMemo } from "react";
import { ProductLocationInPDVChartData } from "./product.types";

/**
 * Componente que muestra un gráfico de barras con la ubicación de productos en punto de venta.
 *
 * @param {{data: {location: string, quantity: number}[]}} props
 * @property {string} location - Nombre de la ubicación en el punto de venta
 * @property {number} quantity - Cantidad de ocaciones que un producto se colocó en esta ubicación
 */

export function ProductLocationInPDVChart({
  data,
}: {
  data: ProductLocationInPDVChartData[];
}) {
  // Calcular el total y los porcentajes para cada ubicación y ordenar de mayor a menor
  const dataWithPercentages = useMemo(() => {
    const total = data.reduce((sum, item) => sum + item.quantity, 0);

    // Crear array con porcentajes
    const dataWithPercentagesArray = data.map((item) => ({
      ...item,
      percentage: total > 0 ? Math.round((item.quantity / total) * 100) : 0,
    }));

    // Ordenar de mayor a menor por cantidad
    return dataWithPercentagesArray.sort((a, b) => b.quantity - a.quantity);
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ubicación del producto en punto de venta</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={dataWithPercentages}
            barGap={0}
            barCategoryGap={10}
            margin={{ left: 0, right: 0, top: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="location"
              className="text-xs"
              interval={0}
              tickFormatter={(value) => value.slice(0, 10)}
              textAnchor="middle"
            />
            <YAxis className="text-xs" />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const { location, quantity } = payload[0].payload;
                  return (
                    <div className="bg-background border border-border p-3">
                      <p className="text-base">{location}</p>
                      <p
                        className="text-base"
                        style={{ color: payload[0].color }}
                      >
                        {quantity} ocasiones
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="quantity" fill="#8884d8">
              <LabelList
                dataKey="percentage"
                position="center"
                fill="#ffffff"
                className="text-sm font-semibold"
                formatter={(value: number) => `${value}%`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
