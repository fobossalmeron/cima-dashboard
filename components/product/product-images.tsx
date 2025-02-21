"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

const images = [
  {
    src: "/placeholder.svg",
    alt: "Producto en Food Star - Leesburg Pike",
    location: "Food Star - Leesburg Pike, 5521 Leesburg Pike, 22041, Bailey's Crossroads, Virginia",
  },
  {
    src: "/placeholder.svg",
    alt: "Producto en Stamford Market - Broad St",
    location: "Stamford Market - Broad St, 123 Broad St, 06901, Stamford, Connecticut",
  },
  {
    src: "/placeholder.svg",
    alt: "Producto en Greenwich Grocer - E Putnam Ave",
    location: "Greenwich Grocer - E Putnam Ave, 456 E Putnam Ave, 06830, Greenwich, Connecticut",
  },
  {
    src: "/placeholder.svg",
    alt: "Producto en Norwalk Mart - Main Ave",
    location: "Norwalk Mart - Main Ave, 789 Main Ave, 06851, Norwalk, Connecticut",
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

