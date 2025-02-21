'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Ambassador {
  name: string;
  activations: number;
  totalSales: number;
  averageSales: number;
}

const ambassadors: Ambassador[] = [
  { name: "Stefee Paola Agudelo", activations: 37, totalSales: 1097, averageSales: 29.65 },
  { name: "Katherin Herrera", activations: 34, totalSales: 851, averageSales: 25.03 },
  { name: "Katheryne Torres", activations: 25, totalSales: 712, averageSales: 28.48 },
  { name: "Marcela Arias", activations: 16, totalSales: 488, averageSales: 30.50 },
  { name: "Maria Gabriela Arteaga", activations: 18, totalSales: 473, averageSales: 26.28 },
  { name: "Angelica Kurbaje", activations: 16, totalSales: 437, averageSales: 27.31 },
  { name: "Cristal Urbaez", activations: 14, totalSales: 370, averageSales: 26.43 },
  { name: "Cristina Espejo", activations: 7, totalSales: 237, averageSales: 33.86 },
  { name: "Natalia Escarraga", activations: 6, totalSales: 192, averageSales: 32.00 },
  { name: "Sofia Jimenez", activations: 5, totalSales: 188, averageSales: 37.60 },
];

export function AmbassadorsTable() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Distribución de ventas por embajadora</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Promotora</TableHead>
              <TableHead className="text-center">Activaciones</TableHead>
              <TableHead className="text-center">Ventas totales</TableHead>
              <TableHead className="text-center">Promedio de ventas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ambassadors.map((ambassador) => (
              <TableRow key={ambassador.name}>
                <TableCell className="font-medium">{ambassador.name}</TableCell>
                <TableCell className="text-center">{ambassador.activations}</TableCell>
                <TableCell className="text-center">{ambassador.totalSales}</TableCell>
                <TableCell className="text-center">{ambassador.averageSales.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 