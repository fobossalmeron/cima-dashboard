"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PromoterImage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Imagen de promotora</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="relative aspect-video group">
            <Image 
              src="/placeholder.svg" 
              alt="Imagen de la promotora" 
              fill 
              className="object-cover rounded-lg" 
            />
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => window.open('/placeholder.svg', '_blank')}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Promotora realizando activación en punto de venta
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 