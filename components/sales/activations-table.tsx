"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Activation {
  fecha: string
  marca: string
  pdv: string
  direccion: string
  ventasTotales: number
  promedioVentas: number
  velocity: number
}

const columns: ColumnDef<Activation>[] = [
  {
    accessorKey: "fecha",
    header: "Fecha",
  },
  {
    accessorKey: "marca",
    header: "Marca",
  },
  {
    accessorKey: "pdv",
    header: "Punto de venta",
  },
  {
    accessorKey: "direccion",
    header: "Dirección",
  },
  {
    accessorKey: "ventasTotales",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full"
        >
          Ventas Totales
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("ventasTotales")}</div>
    },
  },
  {
    accessorKey: "promedioVentas",
    header: "Promedio de Ventas",
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("promedioVentas")}</div>
    },
  },
  {
    accessorKey: "velocity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full"
        >
          Velocity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("velocity")}</div>
    },
  },
]

const data: Activation[] = [
  {
    fecha: "16 Feb 2025",
    marca: "INCAPARINA",
    pdv: "Presidente Supermarket 44",
    direccion: "240 NE 8th St, Homestead, FL 33030",
    ventasTotales: 28,
    promedioVentas: 28,
    velocity: 9.33,
  },
  {
    fecha: "16 Feb 2025",
    marca: "INCAPARINA",
    pdv: "Bravo Supermarket 266",
    direccion: "5011 Broadway, West Palm Beach, FL 33407",
    ventasTotales: 31,
    promedioVentas: 31,
    velocity: 10.33,
  },
  {
    fecha: "15 Feb 2025",
    marca: "INCAPARINA",
    pdv: "Presidente Supermarket 30",
    direccion: "3322 NE 7th St, Homestead, FL 33033",
    ventasTotales: 7,
    promedioVentas: 7,
    velocity: 2.33,
  },
  {
    fecha: "15 Feb 2025",
    marca: "RAPTOR ENERGY DRINK",
    pdv: "Festival Supermarket",
    direccion: "7208 Southgate Blvd, North Lauderdale, FL 33068",
    ventasTotales: 22,
    promedioVentas: 22,
    velocity: 7.33,
  },
  {
    fecha: "15 Feb 2025",
    marca: "INCAPARINA",
    pdv: "Presidente Supermarket 28",
    direccion: "2485 10th Ave N, Lake Worth, FL 33461",
    ventasTotales: 8,
    promedioVentas: 8,
    velocity: 2.67,
  },
  {
    fecha: "14 Feb 2025",
    marca: "DEL FRUTAL AGUAS FRESCAS",
    pdv: "Supermarket 55",
    direccion: "123 Main St, Miami, FL 33101",
    ventasTotales: 45,
    promedioVentas: 45,
    velocity: 15.0,
  },
  {
    fecha: "14 Feb 2025",
    marca: "NÉCTARES NATURAS",
    pdv: "Market 77",
    direccion: "456 Ocean Dr, Miami Beach, FL 33139",
    ventasTotales: 18,
    promedioVentas: 18,
    velocity: 6.0,
  },
  {
    fecha: "13 Feb 2025",
    marca: "SEÑORIAL",
    pdv: "Supermarket 99",
    direccion: "789 Biscayne Blvd, Miami, FL 33132",
    ventasTotales: 12,
    promedioVentas: 12,
    velocity: 4.0,
  },
  {
    fecha: "13 Feb 2025",
    marca: "DEL FRUTAL NÉCTARES",
    pdv: "Market 22",
    direccion: "321 Collins Ave, Miami Beach, FL 33140",
    ventasTotales: 35,
    promedioVentas: 35,
    velocity: 11.67,
  },
  {
    fecha: "12 Feb 2025",
    marca: "DEL FRUTAL PULPA",
    pdv: "Supermarket 33",
    direccion: "654 Lincoln Rd, Miami Beach, FL 33139",
    ventasTotales: 27,
    promedioVentas: 27,
    velocity: 9.0,
  },
]

export function ActivationsTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Historial de samplings</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 