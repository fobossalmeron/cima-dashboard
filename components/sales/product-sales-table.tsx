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
import Image from 'next/image'
import { ProductSaleWithRelations } from '@/types/api/clients'
import { getProductImage } from '@/lib/utils/dashboard-data/sales'

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
                <TableRow key={item.id}>
                  <TableCell className="flex items-center gap-4">
                    <Image
                      src={getProductImage(item.product)}
                      alt={item.product.flavor?.name ?? ''}
                      width={22}
                      height={22}
                      className="object-cover"
                    />
                    {`${item.product.flavor?.name} ${item.product.presentation?.name}`}
                  </TableCell>
                  <TableCell className="text-end">
                    {numberFormatter.format(item.quantity)}
                  </TableCell>
                </TableRow>
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
