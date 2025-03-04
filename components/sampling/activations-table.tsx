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
  getPaginationRowModel,
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { activations } from "@/data/dummy-activations"

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

const data: Activation[] = activations

export function ActivationsTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize,
      },
    },
  })

  const totalPages = Math.ceil(data.length / pageSize)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Historial de samplings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage > 1) {
                      setCurrentPage((p) => p - 1)
                      table.previousPage()
                    }
                  }}
                  className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(i + 1)
                      table.setPageIndex(i)
                    }}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage < totalPages) {
                      setCurrentPage((p) => p + 1)
                      table.nextPage()
                    }
                  }}
                  className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  )
} 