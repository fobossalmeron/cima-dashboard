import { DashboardWithRelations } from '@/types/api/clients'
import {
  PDVTypeChartData,
  ProductLocationInPDVChartData,
  AveragePriceInPDVChartData,
  ProductStatusInPDVChartData,
  OldAndNewActivationsChartData,
  PDVProductImagesData,
} from '@/components/product/product.types'
import { MONTHS } from './months'
import { PhotoTypesEnum } from '@/enums/photos-fields'

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
      submission.productLocationSubmissions.forEach(
        (productLocationSubmission) => {
          const location = productLocationSubmission.productLocation.name
          acc[location] = (acc[location] || 0) + 1
        },
      )
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
  const pricesByBrandAndPDVType = dashboard.submissions.reduce(
    (
      acc: {
        [key: string]: { [key: string]: { total: number; count: number } }
      },
      submission,
    ) => {
      const pdvType = submission.pointOfSale?.name || 'Otros'

      submission.productSales.forEach((sale) => {
        const subBrandName =
          sale.product.subBrand?.name === 'Not specified'
            ? ''
            : sale.product.subBrand?.name
        const brandName = `${sale.product.brand.name} ${subBrandName}`.trim()
        console.log({
          brand: brandName,
          subBrand: subBrandName,
          presentation: sale.product.presentation?.name,
          flavor: sale.product.flavor?.name,
          pdvType,
          price: sale.price,
        })

        if (!acc[brandName]) {
          acc[brandName] = {}
        }

        if (!acc[brandName][pdvType]) {
          acc[brandName][pdvType] = { total: 0, count: 0 }
        }

        acc[brandName][pdvType].total += sale.price
        acc[brandName][pdvType].count++
      })

      return acc
    },
    {},
  )

  return Object.entries(pricesByBrandAndPDVType).map(([brand, pdvTypes]) => ({
    brand,
    averagePriceByPdvType: Object.entries(pdvTypes).reduce(
      (acc, [pdvType, data]) => {
        acc[pdvType] = Number((data.total / data.count).toFixed(2))
        return acc
      },
      {} as { [key: string]: number },
    ),
  }))
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

export function getOldAndNewActivationsChartData(
  dashboard: DashboardWithRelations,
): OldAndNewActivationsChartData[] {
  const monthlyData: Record<string, OldAndNewActivationsChartData> = {}

  dashboard.submissions.forEach((submission) => {
    const date = new Date(submission.startDate)
    const month = date.toLocaleString('es-MX', { month: 'long' }) // Obtener el nombre del mes

    // Inicializar el objeto para el mes si no existe
    if (!monthlyData[month]) {
      monthlyData[month] = {
        month,
        new_location_activations: 0,
        previous_location_activations: 0,
        new_locations: 0,
        previous_locations: 0,
        previousLocations: [],
        newLocations: [],
      }
    }

    // Contar activaciones en tiendas nuevas y anteriores
    if (
      submission.firstActivation &&
      !monthlyData[month].newLocations.includes(submission.location?.id ?? '')
    ) {
      monthlyData[month].new_location_activations++
      if (
        submission.location &&
        !monthlyData[month].newLocations.includes(submission.location.id)
      ) {
        monthlyData[month].new_locations++
        monthlyData[month].newLocations.push(submission.location.id)
      }
    } else {
      monthlyData[month].previous_location_activations++
      if (
        submission.location &&
        !monthlyData[month].previousLocations.includes(submission.location.id)
      ) {
        monthlyData[month].previous_locations++
        monthlyData[month].previousLocations.push(submission.location.id)
      }
    }
  })

  // Convertir el objeto a un array y ordenar por mes
  return Object.values(monthlyData).sort((a, b) => {
    return MONTHS.indexOf(a.month) - MONTHS.indexOf(b.month)
  })
}

export function getPDVProductImages(
  dashboard: DashboardWithRelations,
): PDVProductImagesData[] {
  return dashboard.submissions
    .map((submission) => {
      return submission.photos
        .filter((photo) => photo.type.slug === PhotoTypesEnum.PRODUCT)
        .map((photo) => ({
          locationName: submission.location?.name ?? '',
          address: submission.location?.address ?? '',
          url: photo.url,
        }))
    })
    .flat()
}
