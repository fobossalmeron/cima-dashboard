"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Download } from "lucide-react"
import { useState } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const images = [
  {
    src: "/placeholder.svg",
    alt: "Imagen 1"
  },
  {
    src: "/placeholder.svg",
    alt: "Imagen 2"
  },
  {
    src: "/placeholder.svg",
    alt: "Imagen 3"
  },
  {
    src: "/placeholder.svg",
    alt: "Imagen 4"
  },
  {
    src: "/placeholder.svg",
    alt: "Imagen 5"
  },
  {
    src: "/placeholder.svg",
    alt: "Imagen 6"
  }
]

export function ConsumerImages() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3
  const totalPages = Math.ceil(images.length / itemsPerPage)

  const currentImages = images.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Imágenes de consumidores y producto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentImages.map((image, index) => (
            <div key={index} className="relative aspect-video group">
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
          ))}
        </div>

        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage > 1) setCurrentPage((p) => p - 1)
                }}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentPage(i + 1)
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
                  if (currentPage < totalPages) setCurrentPage((p) => p + 1)
                }}
                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  )
}

