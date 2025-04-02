'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { GiveawayData } from './sampling.types'

/**
 * Componente que muestra la distribución de artículos promocionales (giveaways) por tipo y cantidad.
 *
 * @param {GiveawayData[]} props.data
 * @property {string} type - Tipo de artículo promocional
 * @property {number} quantity - Cantidad de artículos promocionales entregados
 */

export function Giveaways({ data }: { data: GiveawayData[] }) {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Giveaways</CardTitle>
        <CardDescription>
          Distribución de artículos promocionales por tipo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.map((item, index) => (
            <Card key={index} className="bg-white">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-zinc-900 text-center">
                    {item.quantity}
                  </p>
                  <p className="text-zinc-600 text-sm text-center">
                    {item.type}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
