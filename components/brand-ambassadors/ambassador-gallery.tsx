"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

const images = [
  {
    src: "/placeholder.svg",
    alt: "Activación en supermercado",
    ambassador: "Ana García",
    location: "Supermercado Central",
  },
  {
    src: "/placeholder.svg",
    alt: "Activación en centro comercial",
    ambassador: "María Rodríguez",
    location: "Centro Comercial Plaza",
  },
  {
    src: "/placeholder.svg",
    alt: "Activación en tienda",
    ambassador: "Laura Martínez",
    location: "Tienda Express",
  },
  {
    src: "/placeholder.svg",
    alt: "Activación en feria",
    ambassador: "Carmen López",
    location: "Feria del Sabor",
  },
]

export function AmbassadorGallery() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Galería de activaciones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="space-y-2">
              <div className="relative aspect-video">
                <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover rounded-lg" />
              </div>
              <div>
                <p className="font-medium">{image.ambassador}</p>
                <p className="text-sm text-muted-foreground">{image.location}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

