import { DashboardWithRelations } from '@/types/api/clients'
import {
  PDVTypeChartData,
  ProductLocationInPDVChartData,
  AveragePriceInPDVChartData,
  ProductStatusInPDVChartData,
} from '@/components/product/product.types'

export function getPDVTypeData(
  dashboard: DashboardWithRelations,
): PDVTypeChartData[] {
  const typeCount = dashboard.submissions.reduce(
    (acc: { [key: string]: number }, submission) => {
      const type = submission.pointOfSale?.name || 'Otros'
      acc[type] = (acc[type] || 0) + 1
      return acc
    },
    {},
  )

  return Object.entries(typeCount).map(([type, quantity]) => ({
    type,
    quantity,
  }))
}

export function getProductLocationData(
  dashboard: DashboardWithRelations,
): ProductLocationInPDVChartData[] {
  const locationCount = dashboard.submissions.reduce(
    (acc: { [key: string]: number }, submission) => {
      const location = submission.productLocation?.name || 'No especificado'
      acc[location] = (acc[location] || 0) + 1
      return acc
    },
    {},
  )

  return Object.entries(locationCount).map(([location, quantity]) => ({
    location,
    quantity,
  }))
}

export function getAveragePriceData(
  dashboard: DashboardWithRelations,
): AveragePriceInPDVChartData[] {
  const pricesBySubBrand = dashboard.submissions.reduce(
    (acc: { [key: string]: { total: number; count: number } }, submission) => {
      submission.productSales.forEach((sale) => {
        const brandName = `${sale.product.brand.name} ${sale.product.subBrand?.name}`
        if (!acc[brandName]) {
          acc[brandName] = { total: 0, count: 0 }
        }
        acc[brandName].total += sale.price
        acc[brandName].count++
      })
      return acc
    },
    {},
  )

  return Object.entries(pricesBySubBrand)
    .map(([brand, data]) => ({
      brand,
      averagePrice: Number((data.total / data.count).toFixed(2)),
    }))
    .sort((a, b) => b.averagePrice - a.averagePrice)
}

export function getProductStatusInPDVChartData(
  dashboard: DashboardWithRelations,
): ProductStatusInPDVChartData[] {
  const discountCount = dashboard.submissions.reduce(
    (acc, submission) => acc + (submission.productInPromotion ? 1 : 0),
    0,
  )
  const regularCount = dashboard.submissions.length - discountCount

  return [
    { type: 'En promoción', quantity: discountCount },
    { type: 'Precio regular', quantity: regularCount },
  ]
}
