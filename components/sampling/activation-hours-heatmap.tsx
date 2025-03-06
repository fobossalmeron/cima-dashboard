"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface HeatmapData {
  hour: number;
  day: string;
  value: number;
}

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const hours = Array.from({ length: 13 }, (_, i) => i + 6);

// Datos predefinidos más realistas
const data: HeatmapData[] = [
  // Lunes
  { day: "Lunes", hour: 6, value: 10 },
  { day: "Lunes", hour: 7, value: 15 },
  { day: "Lunes", hour: 8, value: 30 },
  { day: "Lunes", hour: 9, value: 60 },
  { day: "Lunes", hour: 10, value: 75 },
  { day: "Lunes", hour: 11, value: 85 },
  { day: "Lunes", hour: 12, value: 90 },
  { day: "Lunes", hour: 13, value: 80 },
  { day: "Lunes", hour: 14, value: 50 },
  { day: "Lunes", hour: 15, value: 70 },
  { day: "Lunes", hour: 16, value: 65 },
  { day: "Lunes", hour: 17, value: 55 },
  { day: "Lunes", hour: 18, value: 40 },
  // Martes (valores más altos por ser día más ocupado)
  { day: "Martes", hour: 6, value: 15 },
  { day: "Martes", hour: 7, value: 25 },
  { day: "Martes", hour: 8, value: 45 },
  { day: "Martes", hour: 9, value: 75 },
  { day: "Martes", hour: 10, value: 85 },
  { day: "Martes", hour: 11, value: 95 },
  { day: "Martes", hour: 12, value: 100 },
  { day: "Martes", hour: 13, value: 90 },
  { day: "Martes", hour: 14, value: 60 },
  { day: "Martes", hour: 15, value: 80 },
  { day: "Martes", hour: 16, value: 75 },
  { day: "Martes", hour: 17, value: 65 },
  { day: "Martes", hour: 18, value: 45 },
  // ... similar pattern for other days ...
].concat(
  // Generar el resto de días con valores similares
  days.slice(2).flatMap((day) =>
    hours.map((hour) => ({
      day,
      hour,
      value: Math.min(
        day === "Sábado"
          ? [10, 15, 30, 45, 55, 60, 65, 60, 50, 45, 40, 35, 30][hour - 6]
          : [15, 25, 45, 75, 85, 90, 85, 80, 60, 70, 65, 55, 40][hour - 6],
        100
      ),
    }))
  )
);

export function ActivationHoursHeatmap() {
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
                  const cellData = data.find(
                    (d) => d.day === day && d.hour === hour
                  );
                  const value = cellData?.value || 0;
                  return (
                    <div
                      key={`${hour}-${day}`}
                      className="relative flex items-center justify-center rounded-sm px-2 py-3 min-h-[32px] transition-colors hover:opacity-90"
                      style={{
                        backgroundColor: `hsl(0, 75%, ${
                          100 - (value / 100) * 50
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
