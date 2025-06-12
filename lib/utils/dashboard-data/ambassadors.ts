import { Ambassador } from '@/components/ambassadors/ambassadors.types'
import { DashboardWithRelations } from '@/types/prisma'

export function getAmbassadorsData(
  dashboard: DashboardWithRelations,
): Ambassador[] {
  // Agrupar por representante
  const ambassadorStats = dashboard.submissions.reduce(
    (acc: { [key: string]: Ambassador }, submission) => {
      const representative = submission.representative
      if (!representative) return acc

      const ambassadorKey = representative.id
      if (!acc[ambassadorKey]) {
        acc[ambassadorKey] = {
          name: representative.name,
          activations: 0,
          totalSales: 0,
          averageSales: 0,
          velocity: 0,
          conversionRate: 0,
          samplesDelivered: 0,
        }
      }

      // Incrementar activaciones
      acc[ambassadorKey].activations++

      // Sumar ventas de esta submission
      acc[ambassadorKey].totalSales += submission.totalQuantity

      // Sumar muestras entregadas de esta submission
      acc[ambassadorKey].samplesDelivered += submission.samplesDelivered || 0

      return acc
    },
    {},
  )

  // Convertir a array y calcular promedios
  return Object.values(ambassadorStats)
    .map((ambassador) => ({
      ...ambassador,
      // Calcular promedio de ventas por activación
      averageSales: Number(
        (ambassador.totalSales / ambassador.activations).toFixed(1),
      ),
      velocity: Number(
        (ambassador.totalSales / (ambassador.activations * 4)).toFixed(1),
      ),
      conversionRate: Number(
        (
          (ambassador.totalSales / (ambassador.samplesDelivered || 1)) *
          100
        ).toFixed(1),
      ),
    }))
    .sort((a, b) => b.totalSales - a.totalSales) // Ordenar por total de ventas
}
