"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

const images = [
  {
    src: "/placeholder.svg",
    alt: "Producto en Supermercado A",
    location: "Supermercado A - Pasillo 5",
  },
  {
    src: "/placeholder.svg",
    alt: "Producto en Tienda B",
    location: "Tienda B - Entrada principal",
  },
  {
    src: "/placeholder.svg",
    alt: "Producto en Gasolinera C",
    location: "Gasolinera C - Área de snacks",
  },
  {
    src: "/placeholder.svg",
    alt: "Producto en Tienda D",
    location: "Tienda D - Nevera principal",
  },
]

export function ProductImages() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Imágenes del producto en puntos de venta</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="space-y-2">
              <div className="relative aspect-square">
                <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover rounded-lg" />
              </div>
              <p className="text-sm text-muted-foreground">{image.location}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

