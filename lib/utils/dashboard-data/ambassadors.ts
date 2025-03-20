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
        }
      }

      // Incrementar activaciones
      acc[ambassadorKey].activations++

      // Sumar ventas de esta submission
      const submissionSales = submission.productSales.reduce(
        (sum, sale) => sum + sale.quantity,
        0,
      )
      acc[ambassadorKey].totalSales += submissionSales

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
