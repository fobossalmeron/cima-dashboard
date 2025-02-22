'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";

interface Ambassador {
  name: string;
  activations: number;
  totalSales: number;
  averageSales: number;
}

const ambassadors: Ambassador[] = [
  { name: "Laura Martinez", activations: 32, totalSales: 1025, averageSales: 32.03 },
  { name: "Camila Rodriguez", activations: 28, totalSales: 925, averageSales: 33.04 },
  { name: "Valentina Gomez", activations: 24, totalSales: 812, averageSales: 33.83 },
  { name: "Isabella Fernandez", activations: 22, totalSales: 765, averageSales: 34.77 },
  { name: "Sofia Lopez", activations: 20, totalSales: 720, averageSales: 36.00 },
  { name: "Maria Garcia", activations: 19, totalSales: 680, averageSales: 35.79 },
  { name: "Lucia Perez", activations: 18, totalSales: 650, averageSales: 36.11 },
  { name: "Emma Sanchez", activations: 17, totalSales: 625, averageSales: 36.76 },
  { name: "Mia Ramirez", activations: 16, totalSales: 600, averageSales: 37.50 },
  { name: "Victoria Torres", activations: 15, totalSales: 575, averageSales: 38.33 },
  { name: "Stefee Paola Agudelo", activations: 37, totalSales: 1097, averageSales: 29.65 },
  { name: "Katherin Herrera", activations: 34, totalSales: 851, averageSales: 25.03 },
  { name: "Katheryne Torres", activations: 25, totalSales: 712, averageSales: 28.48 },
  { name: "Marcela Arias", activations: 16, totalSales: 488, averageSales: 30.50 },
  { name: "Maria Gabriela Arteaga", activations: 18, totalSales: 473, averageSales: 26.28 },
  { name: "Angelica Kurbaje", activations: 16, totalSales: 437, averageSales: 27.31 },
  { name: "Cristal Urbaez", activations: 14, totalSales: 370, averageSales: 26.43 },
  { name: "Cristina Espejo", activations: 7, totalSales: 237, averageSales: 33.86 },
  { name: "Natalia Escarraga", activations: 6, totalSales: 192, averageSales: 32.00 },
  { name: "Sofia Jimenez", activations: 5, totalSales: 188, averageSales: 37.60 }
];

export function AmbassadorsTable() {
  return (
    <Card className="w-full relative">
      <CardHeader>
        <CardTitle>Detalle de embajadoras</CardTitle>
        <CardDescription>
          Activaciones y ventas por embajadora, haz scroll para ver más.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-8">
        <div className="relative">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <TableHead className="w-[35%]">Promotora</TableHead>
                <TableHead className="w-[20%] text-center">Activaciones</TableHead>
                <TableHead className="w-[20%] text-center">Ventas totales</TableHead>
                <TableHead className="w-[25%] text-center">Promedio de ventas</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
          <div className="max-h-[360px] overflow-auto">
            <Table>
              <TableBody>
                {ambassadors.map((ambassador) => (
                  <TableRow key={ambassador.name}>
                    <TableCell className="w-[35%] font-medium">{ambassador.name}</TableCell>
                    <TableCell className="w-[20%] text-center">{ambassador.activations}</TableCell>
                    <TableCell className="w-[20%] text-center">{ambassador.totalSales}</TableCell>
                    <TableCell className="w-[25%] text-center">{ambassador.averageSales.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="absolute bottom-2 right-1/2 translate-x-1/2 text-gray-400">
          <ChevronDown size={20} />
        </div>
      </CardContent>
    </Card>
  );
} 