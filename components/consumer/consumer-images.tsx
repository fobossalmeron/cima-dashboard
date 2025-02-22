"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Download, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

// Expandimos el array de imágenes para tener más contenido por columna
const images = [
  {
    category: "Cliente pagando el producto",
    items: Array(15).fill(null).map((_, i) => ({
      src: "/placeholder.svg",
      alt: `Persona comprando el producto ${i + 1}`,
      description: `Cliente pagando el producto ${i + 1}`,
    }))
  },
  {
    category: "Exhibición del producto en punto de venta",
    items: Array(15).fill(null).map((_, i) => ({
      src: "/placeholder.svg",
      alt: `Producto en anaquel ${i + 1}`,
      description: `Exhibición del producto en punto de venta ${i + 1}`,
    }))
  },
  {
    category: "Consumidor con el producto",
    items: Array(15).fill(null).map((_, i) => ({
      src: "/placeholder.svg",
      alt: `Persona con el producto ${i + 1}`,
      description: `Consumidor con el producto ${i + 1}`,
    }))
  }
]

export function ConsumerImages() {
  const [pages, setPages] = useState([0, 0, 0]) // Un índice de página por columna
  const imagesPerPage = 5

  const handlePageChange = (columnIndex: number, direction: 'prev' | 'next') => {
    setPages(prevPages => {
      const newPages = [...prevPages]
      const maxPage = Math.ceil(images[columnIndex].items.length / imagesPerPage) - 1
      if (direction === 'next' && newPages[columnIndex] < maxPage) {
        newPages[columnIndex]++
      } else if (direction === 'prev' && newPages[columnIndex] > 0) {
        newPages[columnIndex]--
      }
      return newPages
    })
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Imágenes de consumidores y producto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-4">
              <h3 className="font-medium text-sm">{category.category}</h3>
              <div className="space-y-4 h-[350px] overflow-y-auto">
                {category.items
                  .slice(
                    pages[categoryIndex] * imagesPerPage,
                    (pages[categoryIndex] + 1) * imagesPerPage
                  )
                  .map((image, imageIndex) => (
                    <div key={imageIndex} className="space-y-2">
                      <div className="relative aspect-video group">
                        <Image 
                          src={image.src} 
                          alt={image.alt} 
                          fill 
                          className="object-cover rounded-lg" 
                        />
                        <Button
                          size="icon"
                          variant="secondary"
                          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => window.open(image.src, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="flex justify-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handlePageChange(categoryIndex, 'prev')}
                  disabled={pages[categoryIndex] === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="py-2 text-sm">
                  {pages[categoryIndex] + 1} / {Math.ceil(category.items.length / imagesPerPage)}
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handlePageChange(categoryIndex, 'next')}
                  disabled={pages[categoryIndex] === Math.ceil(category.items.length / imagesPerPage) - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

