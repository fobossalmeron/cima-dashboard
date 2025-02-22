"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

interface ProductSalesData {
  id: number;
  presentation: string;
  flavor: string;
  sales: number;
  image: string;
}

export function ProductSalesChart({
  data,
  title,
}: {
  data: ProductSalesData[];
  title: string;
}) {
  const totalVentas = data.reduce((sum, item) => sum + item.sales, 0);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Unidades vendidas</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sabor</TableHead>
                <TableHead className="text-center">Presentación</TableHead>
                <TableHead className="text-center">Unidades</TableHead>
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
                  <TableCell className="text-center">
                    {item.presentation}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.sales.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="font-medium border-t">
                <TableCell className="pt-4">Total</TableCell>
                <TableCell className="pt-4"></TableCell>
                <TableCell className="text-center pt-4">
                  {totalVentas.toLocaleString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
