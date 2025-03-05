"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Download } from "lucide-react";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ConsumerImagesData } from "./consumer.types";

/**
 * Componente que muestra una galería de imágenes de consumidores y productos.
 *
 * @param {{ConsumerImagesData[]}} props.data
 * @property {string} locationName - Nombre de la ubicación (ej. "Food Star", "Stamford Market", etc.)
 * @property {string} address - Dirección de la ubicación (ej. "5521 Leesburg Pike, 22041, Bailey's Crossroads, Virginia")
 * @property {string} url - URL de AWS de la imagen (ej. "https://s3.amazonaws.com/bucket-name/image-name.jpg")
 */

export function ConsumerImages({ data }: { data: ConsumerImagesData[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentImages = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Imágenes de consumidores y producto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {currentImages.map((image, index) => (
            <div key={index} className="space-y-2">
              <div className="relative aspect-video group">
                <Image
                  src={image.url}
                  alt={image.locationName + " " + image.address}
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
