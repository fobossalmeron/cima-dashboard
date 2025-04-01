import { Ambassador } from '@/components/ambassadors/ambassadors.types'
import { DashboardWithRelations } from '@/types/api/clients'

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
        }
      }

      // Incrementar activaciones
      acc[ambassadorKey].activations++

      // Sumar ventas de esta submission
      acc[ambassadorKey].totalSales += submission.totalQuantity

      // Sumar velocidad de ventas de esta submission
      acc[ambassadorKey].velocity += submission.totalQuantity / 4

      // Sumar tasa de conversión de esta submission
      acc[ambassadorKey].conversionRate +=
        (submission.totalQuantity / (submission.samplesDelivered || 1)) * 100

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
        (ambassador.totalSales / ambassador.activations).toFixed(2),
      ),
    }))
    .sort((a, b) => b.totalSales - a.totalSales) // Ordenar por total de ventas
}
