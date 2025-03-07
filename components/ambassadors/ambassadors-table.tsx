"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { Ambassador } from "./ambassadors.types";

/**
 * Componente que muestra una tabla de embajadoras con sus activaciones y ventas.
 * Todos los componentes de la página /ambassadors usan la misma data y el mismo tipo
 *
 * @param {Ambassador[]} props.data
 * @property {string} name - Nombre de la embajadora
 * @property {number} activations - Número de activaciones
 * @property {number} totalSales - Total de ventas
 * @property {number} averageSales - Promedio de ventas
 */

export function AmbassadorsTable({ data }: { data: Ambassador[] }) {
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
                <TableHead className="w-[20%] text-center">
                  Activaciones
                </TableHead>
                <TableHead className="w-[20%] text-center">
                  Ventas totales
                </TableHead>
                <TableHead className="w-[25%] text-center">
                  Promedio de ventas
                </TableHead>
              </TableRow>
            </TableHeader>
          </Table>
          <div className="max-h-[360px] overflow-auto">
            <Table>
              <TableBody>
                {data.map((ambassador) => (
                  <TableRow key={ambassador.name}>
                    <TableCell className="w-[35%] font-medium">
                      {ambassador.name}
                    </TableCell>
                    <TableCell className="w-[20%] text-center">
                      {ambassador.activations}
                    </TableCell>
                    <TableCell className="w-[20%] text-center">
                      {ambassador.totalSales}
                    </TableCell>
                    <TableCell className="w-[25%] text-center">
                      {ambassador.averageSales.toFixed(2)}
                    </TableCell>
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
