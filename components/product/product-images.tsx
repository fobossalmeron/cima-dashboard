"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
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
    src: "/assets/dummy/pdv1.jpg",
    alt: "Producto en Food Star - Leesburg Pike",
    location: "Food Star - Leesburg Pike, 5521 Leesburg Pike, 22041, Bailey's Crossroads, Virginia",
  },
  {
    src: "/assets/dummy/pdv2.jpg",
    alt: "Producto en Stamford Market - Broad St",
    location: "Stamford Market - Broad St, 123 Broad St, 06901, Stamford, Connecticut",
  },
  {
    src: "/assets/dummy/pdv3.jpg",
    alt: "Producto en Greenwich Grocer - E Putnam Ave",
    location: "Greenwich Grocer - E Putnam Ave, 456 E Putnam Ave, 06830, Greenwich, Connecticut",
  },
  {
    src: "/assets/dummy/pdv4.jpg",
    alt: "Producto en Norwalk Mart - Main Ave",
    location: "Norwalk Mart - Main Ave, 789 Main Ave, 06851, Norwalk, Connecticut",
  },
  {
    src: "/assets/dummy/pdv5.jpg",
    alt: "Producto en Stamford Market - Broad St",
    location: "Stamford Market - Broad St, 123 Broad St, 06901, Stamford, Connecticut",
  },
]

export function ProductImages() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4
  const totalPages = Math.ceil(images.length / itemsPerPage)

  const currentImages = images.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

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
                <Image src={image.src} alt={image.alt} fill className="object-cover rounded-lg" />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => window.open(image.src, '_blank')}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{image.location}</p>
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

