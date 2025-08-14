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
  Accordion,
  AccordionItem,
  AccordionContent,
} from '@/components/ui/accordion'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { ActivationsHistoryTableData } from './sampling.types'

const columns: ColumnDef<ActivationsHistoryTableData>[] = [
  {
    accessorKey: 'date',
    header: 'Fecha',
  },
  {
    accessorKey: 'brand',
    header: 'Marca',
  },
  {
    accessorKey: 'locationName',
    header: 'Punto de venta',
  },
  {
    accessorKey: 'address',
    header: 'Dirección',
  },
  {
    accessorKey: 'sales',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="w-full"
        >
          Ventas Totales
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue('sales')}</div>
    },
  },
  {
    accessorKey: 'velocity',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="w-full"
        >
          Velocity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue('velocity')}</div>
    },
  },
  {
    accessorKey: 'conversionRate',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="w-full"
        >
          Conversión
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="text-center">{row.getValue('conversionRate')}%</div>
      )
    },
  },
]

/**
 * Componente que muestra una tabla con el historial de activaciones de productos.
 *
 * @param {ActivationsHistoryTableData[]} props.data
 * @property {string} date - Fecha de la activación (ej. "16 Feb 2025")
 * @property {string} brand - Marca del producto (ej. "Del Frutal", "Naturas", etc.)
 * @property {string} locationName - Nombre de la ubicación (ej. "Presidente Supermarket 44")
 * @property {string} address - Dirección de la ubicación (ej. "240 NE 8th St, Homestead, FL 33030")
 * @property {number} sales - Ventas totales durante la activación
 * @property {number} velocity - Velocidad de ventas (ventas / 4 horas que dura la activación)
 * @property {number} conversionRate - Tasa de conversión (ventas / visitas)
 * @property {string} comment - Comentario de inventario en PDV
 */

const dummyComment = `10 cajas antes, 5 después. Sin acceso a bodega.`

export function ActivationsHistoryTable({
  data,
}: {
  data: ActivationsHistoryTableData[]
}) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
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

  const handleRowClick = (rowId: string) => {
    setExpandedRow(expandedRow === rowId ? null : rowId)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Historial de demos</CardTitle>
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
                              header.getContext(),
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
                  <>
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      onClick={() => handleRowClick(row.id)}
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    {expandedRow === row.id && (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="p-0">
                          <Accordion type="single" value="open" collapsible>
                            <AccordionItem value="open" className="border-0">
                              <AccordionContent className="p-0">
                                <div className="p-4 px-2 text-sm">
                                  <div className="font-medium text-muted-foreground mb-2">
                                    Comentario de inventario en PDV
                                  </div>
                                  <div className="text-foreground p-0">
                                    {dummyComment || 'Sin comentarios'}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
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
                  className={
                    !table.getCanPreviousPage()
                      ? 'pointer-events-none opacity-50'
                      : ''
                  }
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
                  className={
                    !table.getCanNextPage()
                      ? 'pointer-events-none opacity-50'
                      : ''
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  )
}
