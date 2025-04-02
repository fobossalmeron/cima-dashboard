'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import Image from 'next/image'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { PromoterImageData } from './sampling.types'

/**
 * Componente que muestra una galería de imágenes de promotoras en puntos de venta.
 *
 * @param {PromoterImageData[]} props.data
 * @property {string} url - URL de AWS de la imagen (ej. "https://s3.amazonaws.com/bucket-name/image-name.jpg")
 * @property {string} name - Nombre de la promotora
 */

export function PromoterImages({ data }: { data: PromoterImageData[] }) {
  const [currentPage, setCurrentPage] = useState(1)
  const imagesPerPage = 3
  const totalPages = Math.ceil(data.length / imagesPerPage)

  // Calcular las imágenes a mostrar en la página actual
  const startIndex = (currentPage - 1) * imagesPerPage
  const currentImages = data.slice(startIndex, startIndex + imagesPerPage)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Imagenes de promotoras</CardTitle>
        <CardDescription>
          Imagenes de las promotoras en el punto de venta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 gap-4">
            {currentImages.map((image, index) => (
              <div
                key={startIndex + index}
                className="relative aspect-video group"
              >
                <Image
                  src={image.url}
                  alt={image.name}
                  fill
                  className="object-cover rounded-lg"
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => window.open(image.url, '_blank')}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage > 1) setCurrentPage((p) => p - 1)
                    }}
                    className={
                      currentPage <= 1 ? 'pointer-events-none opacity-50' : ''
                    }
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="px-4 text-sm">
                    Página {currentPage} de {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage < totalPages) setCurrentPage((p) => p + 1)
                    }}
                    className={
                      currentPage >= totalPages
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
