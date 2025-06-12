'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { POPImageData } from './sampling.types'

/**
 * Componente que muestra una galería de imágenes de material POP en puntos de venta.
 *
 * @param {POPImageData[]} props.data
 * @property {string} url - URL de AWS de la imagen (ej. "https://s3.amazonaws.com/bucket-name/image-name.jpg")
 * @property {string} name - Nombre o descripción del material POP
 */

export function POPImages({ data }: { data: POPImageData[] }) {
  const [currentPage, setCurrentPage] = useState(1)
  const imagesPerPage = 2 // Solo 2 imágenes en desktop como solicitado
  const totalPages = Math.ceil(data.length / imagesPerPage)

  // Calcular las imágenes a mostrar en la página actual
  const startIndex = (currentPage - 1) * imagesPerPage
  const currentImages = data.slice(startIndex, startIndex + imagesPerPage)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Material POP - Imágenes de material POP</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 h-full flex flex-col justify-between">
          <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4">
            {currentImages.length > 0 ? (
              currentImages.map((image, index) => (
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
              ))
            ) : (
              <div className="relative aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground text-sm">
                  No se encontraron imágenes de material POP
                </p>
              </div>
            )}
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
