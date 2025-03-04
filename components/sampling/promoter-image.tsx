"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Image from "next/image"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
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
    alt: "Imagen de la promotora 1"
  },
  {
    src: "/placeholder.svg",
    alt: "Imagen de la promotora 2"
  },
  {
    src: "/placeholder.svg",
    alt: "Imagen de la promotora 3"
  }
]

export function PromoterImage() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = images.length
  const currentImage = images[currentPage - 1]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Imagen de promotora</CardTitle>
        <CardDescription>
          Imagen de la promotora en el punto de venta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative aspect-video group">
            <Image 
              src={currentImage.src}
              alt={currentImage.alt}
              fill 
              className="object-cover rounded-lg" 
            />
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => window.open(currentImage.src, '_blank')}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>

          <Pagination>
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
        </div>
      </CardContent>
    </Card>
  )
} 