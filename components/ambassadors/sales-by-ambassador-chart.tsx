'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SalesByAmbassadorData {
  name: string;
  value: number;
}

const data: SalesByAmbassadorData[] = [
  { name: 'Stefee Paola Agudelo', value: 24 },
  { name: 'Katherin Herrera', value: 17 },
  { name: 'Katheryne Torres', value: 11 },
  { name: 'Maria Gabriela Arteaga', value: 1  },
  { name: 'Angelica Kurbaje', value: 4 },
  { name: 'Marcela Arias', value: 12 },
  { name: 'Cristal Urbaez', value: 4 },
  { name: 'Maria Camila Gutierrez', value: 4 },
  { name: 'Cristina Espejo', value: 10 },
  { name: 'Astrid Suarez', value: 5 },
  { name: 'Natalia Escarraga', value: 5 },
  { name: 'Maria Monica', value: 3 },
];
const COLORS = [
  '#FF4D4D', '#00C2B8', '#00A8CC', '#6BCB77', '#FFD966',
  '#D98880', '#A569BD', '#E59866', '#48C9B0', '#2980B9',
  '#8E44AD', '#C39BD3'
];

export function SalesByAmbassadorChart() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Distribución de ventas por embajadora</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                fontSize={12}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ fontSize: '14px' }}
                formatter={(value: number, name: string, props: any) => {
                  const total = data.reduce((sum, item) => sum + item.value, 0);
                  const percent = ((value / total) * 100).toFixed(1);
                  return [`${value} (${percent}%)`, name];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 