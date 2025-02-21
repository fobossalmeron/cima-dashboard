"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

const images = [
  {
    src: "/placeholder.svg",
    alt: "Persona comprando el producto",
    description: "Cliente pagando el producto",
  },
  {
    src: "/placeholder.svg",
    alt: "Producto en anaquel",
    description: "Exhibición del producto en punto de venta",
  },
  {
    src: "/placeholder.svg",
    alt: "Persona con el producto",
    description: "Consumidor con el producto",
  },
]

export function ConsumerImages() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Imágenes de consumidores y producto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="space-y-2">
              <div className="relative aspect-video group">
                <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover rounded-lg" />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => window.open(image.src, '_blank')}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{image.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

