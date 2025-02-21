'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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
  { name: 'Cristal Urbaez', value: 7 },
  { name: 'Maria Camila Gutierrez', value: 1 },
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

function formatShortName(fullName: string) {
  const firstName = fullName.split(' ')[0];
  const lastName = fullName.split(' ').slice(-1)[0];
  return `${firstName[0]}. ${lastName}`;
}

export function SalesByAmbassadorChart() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Distribución de ventas por embajadora</CardTitle>
        <CardDescription>
          Porcentaje de ventas por cada embajadora.
        </CardDescription>
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
                label={({ name, percent }) => 
                  `${formatShortName(name)} (${(percent * 100).toFixed(0)}%)`
                }
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
                formatter={(value: number, name: string) => {
                  const total = data.reduce((sum, item) => sum + item.value, 0);
                  const percent = ((value / total) * 100).toFixed(1);
                  return [`${value} (${percent}%)`, formatShortName(name)];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 