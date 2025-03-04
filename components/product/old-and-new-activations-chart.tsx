"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

interface OldAndNewActivationsChart {
  month: string;
  new_location_activations: number;
  previous_location_activations: number;
  new_locations: number;
  previous_locations: number;
}

/**
 * Componente que muestra un gráfico de barras comparando activaciones en tiendas nuevas y anteriores.
 * Visualiza datos de los *6 últimos meses* del rango de fechas seleccionado.
 *
 * @param {OldAndNewActivationsChart[]} props.data
 * @property {string} month - El mes de los datos (máximo 6 meses)
 * @property {number} new_location_activations - Número de activaciones en tiendas nuevas
 * @property {number} previous_location_activations - Número de activaciones en tiendas anteriores
 * @property {number} new_locations - Número de tiendas nuevas
 * @property {number} previous_locations - Número de tiendas anteriores
 */
export function OldAndNewActivationsChart({
  data,
}: {
  data: OldAndNewActivationsChart[];
}) {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Activaciones en tiendas nuevas y anteriores</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" style={{ fontSize: "12px" }} />
            <YAxis style={{ fontSize: "12px" }} />
            <Tooltip />
            <Legend
              wrapperStyle={{
                fontSize: "14px",
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                paddingLeft: "10px",
                paddingRight: "10px",
              }}
              iconType="circle"
              iconSize={12}
            />
            <Bar
              dataKey="new_location_activations"
              name="Activaciones en Tiendas Nuevas"
              fill="#0088FE"
            >
              <LabelList
                dataKey="new_location_activations"
                position="top"
                style={{ fontSize: "11px" }}
              />
            </Bar>
            <Bar
              dataKey="previous_location_activations"
              name="Activaciones en Tiendas Anteriores"
              fill="#00C49F"
            >
              <LabelList
                dataKey="previous_location_activations"
                position="top"
                style={{ fontSize: "11px" }}
              />
            </Bar>
            <Bar dataKey="new_locations" name="Tiendas Nuevas" fill="#FFBB28">
              <LabelList
                dataKey="new_locations"
                position="top"
                style={{ fontSize: "11px" }}
              />
            </Bar>
            <Bar
              dataKey="previous_locations"
              name="Tiendas Anteriores"
              fill="#FF8042"
            >
              <LabelList
                dataKey="previous_locations"
                position="top"
                style={{ fontSize: "11px" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
