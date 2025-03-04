"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PDVProductImagesData {
  locationName: string;
  address: string;
  url: string;
}

/**
 * Componente que muestra una galería de imágenes del producto en diferentes puntos de venta.
 *
 * @param {{PDVProductImagesData[]}} props.data
 * @property {string} locationName - Nombre del punto de venta
 * @property {string} address - Dirección del punto de venta
 * @property {string} url - URL de AWS de la imagen del producto en anaquel
 */

export function PDVProductImages({ data }: { data: PDVProductImagesData[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentImages = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Imágenes del producto en puntos de venta</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentImages.map((image, index) => (
            <div key={index} className="space-y-2">
              <div className="relative aspect-square group">
                <Image
                  src={image.url}
                  alt={`Producto en ${image.locationName}`}
                  fill
                  className="object-cover rounded-lg"
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => window.open(image.url, "_blank")}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {image.locationName + " - " + image.address}
              </p>
            </div>
          ))}
        </div>

        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage((p) => p - 1);
                }}
                className={
                  currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(i + 1);
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
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage((p) => p + 1);
                }}
                className={
                  currentPage >= totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  );
}
