import { ActivationsHistoryTableData } from '@/components/sampling/sampling.types'
import { DashboardWithRelations } from '@/types/api/clients'

export function getActivationsHistory(
  dashboard: DashboardWithRelations,
): ActivationsHistoryTableData[] {
  return dashboard.submissions
    .map((submission) => {
      const velocity =
        submission.productSales.reduce((acc, sale) => acc + sale.quantity, 0) /
        submission.productSales.length
      return {
        date: new Date(submission.submittedAt).toLocaleDateString('es-MX', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        brand: submission.activatedBrands
          .map((activatedBrand) => activatedBrand.brand.name)
          .join(', '),
        locationName: submission.location?.name ?? '',
        address: submission.location?.address ?? '',
        sales: submission.productSales.reduce(
          (acc, sale) => acc + sale.quantity,
          0,
        ),
        velocity: Number(velocity.toFixed(2)),
        time: new Date(submission.submittedAt),
      }
    })
    .sort((a, b) => b.time.getTime() - a.time.getTime())
}
