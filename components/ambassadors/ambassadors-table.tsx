'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import { ChevronDown } from 'lucide-react'
import { Ambassador } from './ambassadors.types'

/**
 * Componente que muestra una tabla de embajadoras con sus activaciones y ventas.
 * Todos los componentes de la página /ambassadors usan la misma data y el mismo tipo
 *
 * @param {Ambassador[]} props.data
 * @property {string} name - Nombre de la embajadora
 * @property {number} activations - Número de activaciones
 * @property {number} totalSales - Total de ventas
 * @property {number} averageSales - Promedio de ventas
 * @property {number} velocity - Velocidad de ventas
 * @property {number} conversionRate - Tasa de conversión
 */

export function AmbassadorsTable({ data }: { data: Ambassador[] }) {
  return (
    <Card className="w-full relative">
      <CardHeader>
        <CardTitle>Detalle de embajadoras</CardTitle>
        <CardDescription>
          Demos y ventas por embajadora, haz scroll para ver más.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-8">
        <div className="relative">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <TableHead className="w-[25%]">Promotora</TableHead>
                <TableHead className="w-[15%] text-center">Demos</TableHead>
                <TableHead className="w-[15%] text-center">
                  Ventas totales
                </TableHead>
                <TableHead className="w-[15%] text-center">
                  Promedio de ventas
                </TableHead>
                <TableHead className="w-[15%] text-center">Velocity</TableHead>
                <TableHead className="w-[15%] text-center">
                  Conversión
                </TableHead>
              </TableRow>
            </TableHeader>
          </Table>
          <div className="max-h-[360px] overflow-auto">
            <Table>
              <TableBody>
                {data.map((ambassador) => (
                  <TableRow key={ambassador.name}>
                    <TableCell className="w-[25%] font-medium">
                      {ambassador.name}
                    </TableCell>
                    <TableCell className="w-[15%] text-center">
                      {ambassador.activations}
                    </TableCell>
                    <TableCell className="w-[15%] text-center">
                      {ambassador.totalSales}
                    </TableCell>
                    <TableCell className="w-[15%] text-center">
                      {ambassador.averageSales.toFixed(1)}
                    </TableCell>
                    <TableCell className="w-[15%] text-center">
                      {ambassador.velocity.toFixed(1)}
                    </TableCell>
                    <TableCell className="w-[15%] text-center">
                      {ambassador.conversionRate.toFixed(1)}%
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
  )
}
