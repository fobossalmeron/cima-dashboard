"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { ProductSalesData } from "@/components/sales/sales.types";

export function ProductSalesTable({
  data,
  title,
}: {
  data: ProductSalesData[];
  title: string;
}) {
  const totalVentas = data.reduce((sum, item) => sum + item.sales, 0);
  const numberFormatter = new Intl.NumberFormat("es-MX");

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
                      src={`/assets/products/${item.image}`}
                      alt={item.flavor}
                      width={22}
                      height={22}
                      className="object-cover"
                    />
                    {item.flavor}
                  </TableCell>
                  <TableCell className="text-end">
                    {numberFormatter.format(item.sales)}
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
  );
}
