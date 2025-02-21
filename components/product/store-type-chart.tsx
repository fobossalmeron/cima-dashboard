"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Label } from "recharts"

const data = [
  { name: "Supermarket", value: 40, fill: "#0088FE" },
  { name: "Midmarket", value: 30, fill: "#00C49F" },
  { name: "Downtrade", value: 20, fill: "#FFBB28" },
  { name: "Convenience", value: 10, fill: "#FF8042" },
]

const TOTAL_PDV = 312

export function StoreTypePieChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tipo de punto de venta</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <div className="w-1/2">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {TOTAL_PDV}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            PDV
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
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
  )
}

