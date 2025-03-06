"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HeatmapDataStructure, WeekDay } from "./sampling.types";

const days: WeekDay[] = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];
const hours = Array.from({ length: 13 }, (_, i) => i + 6);

/**
 * Componente que muestra un mapa de calor de las horas de activación.
 * Representa la intensidad de compra por hora y día de la semana.
 *
 * @param {HeatmapDataStructure} props.data
 * @property {Record<WeekDay, { [hour: number]: number }>} data - Datos organizados por día y hora
 * @property {WeekDay} data.key - Día de la semana (Lunes, Martes, etc.)
 * @property {number} data.value - Velocity promedio por hora
 */

export function ActivationHoursHeatmap({
  data,
}: {
  data: HeatmapDataStructure;
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Velocity promedio por hora</CardTitle>
        <CardDescription>
          Intensidad de compra por hora y día de la semana
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="py-4">
          {/* Grid principal que incluye etiquetas y datos */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: `auto repeat(${days.length}, 1fr)`,
              gap: "2px",
            }}
          >
            {/* Celda vacía en la esquina superior izquierda */}
            <div className="h-8"></div>

            {/* Etiquetas del eje X (días) */}
            {days.map((day) => (
              <div
                key={day}
                className="text-center text-xs text-muted-foreground h-8 flex items-center justify-center"
              >
                {day}
              </div>
            ))}

            {/* Filas con etiquetas de horas y celdas de datos */}
            {hours.map((hour) => (
              <React.Fragment key={`row-${hour}`}>
                {/* Etiqueta de hora */}
                <div className="text-sm text-muted-foreground pr-2 flex items-center justify-end min-h-[32px]">
                  {`${hour}:00`}
                </div>

                {/* Celdas de datos para esta hora */}
                {days.map((day) => {
                  const value = data[day]?.[hour] || 0;
                  return (
                    <div
                      key={`${hour}-${day}`}
                      className="relative flex items-center justify-center rounded-sm px-2 py-3 min-h-[32px] transition-colors hover:opacity-90"
                      style={{
                        backgroundColor: `hsl(136, 67%, ${
                          100 - (value / 100) * 90
                        }%)`,
                      }}
                    >
                      <span className="absolute text-xs font-medium text-white mix-blend-difference">
                        {value}
                      </span>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
