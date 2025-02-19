"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

const images = [
  {
    src: "/placeholder.svg",
    alt: "Consumidor con producto",
    description: "Consumidor disfrutando el producto en casa",
  },
  {
    src: "/placeholder.svg",
    alt: "Producto en anaquel",
    description: "Exhibición del producto en supermercado",
  },
  {
    src: "/placeholder.svg",
    alt: "Grupo de consumidores",
    description: "Consumidores en reunión social",
  },
  {
    src: "/placeholder.svg",
    alt: "Producto en uso",
    description: "Consumo del producto en oficina",
  },
]

export function ConsumerImages() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Imágenes de consumidores y producto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="space-y-2">
              <div className="relative aspect-video">
                <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover rounded-lg" />
              </div>
              <p className="text-sm text-muted-foreground">{image.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

