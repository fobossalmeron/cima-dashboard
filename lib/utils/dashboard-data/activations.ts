import { ActivationSalesChartData } from '@/components/general/general.types'
import { DashboardWithRelations } from '@/types/prisma'
import { MONTHS } from './months'

export const getChartData = (
  dashboardData: DashboardWithRelations,
): ActivationSalesChartData[] => {
  return dashboardData?.submissions
    ? Object.entries(
        // Agrupar submissions por mes
        dashboardData.submissions.reduce((acc, submission) => {
          const date = new Date(submission.startDate)
          const monthKey = `${date.getFullYear()}-${date.getMonth()}`

          if (!acc[monthKey]) {
            acc[monthKey] = {
              month: MONTHS[date.getMonth()],
              activations: 0,
              totalSales: 0,
              averageSales: 0,
            }
          }

          acc[monthKey].activations += 1
          // Agregar ventas totales del submission
          acc[monthKey].totalSales += submission.totalQuantity || 0
          return acc
        }, {} as Record<string, ActivationSalesChartData>),
      )
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(([_, data]) => ({
          ...data,
          // Calcular el promedio de ventas por activación
          averageSales:
            data.activations > 0
              ? Math.round(data.totalSales / data.activations)
              : 0,
        }))
        .sort((a, b) => MONTHS.indexOf(a.month) - MONTHS.indexOf(b.month))
    : []
}
