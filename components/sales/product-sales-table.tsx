'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ProductSaleWithRelations } from '@/types/api/clients'
import { ProductSalesTableRow } from './product-sales-table-row'

export function ProductSalesTable({
  data,
  title,
}: {
  data: ProductSaleWithRelations[]
  title: string
}) {
  const totalVentas = data.reduce((sum, item) => sum + item.quantity, 0)
  const numberFormatter = new Intl.NumberFormat('es-MX')

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Presentación</TableHead>
                <TableHead className="text-end">Unidades vendidas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <ProductSalesTableRow key={item.id} item={item} />
              ))}
              <TableRow className="font-medium border-t">
                <TableCell className="pt-4">Total</TableCell>
                <TableCell className="text-end pt-4">
                  {numberFormatter.format(totalVentas)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
