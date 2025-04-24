/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ActivationsHistoryTableData,
  GiveawayData,
  HeatmapDataActivationsStructure,
  HeatmapDataStructure,
  PromoterImageData,
  Range,
  TrafficDuringActivationChartData,
} from '@/components/sampling/sampling.types'
import { PhotoTypesEnum } from '@/enums/photos-fields'
import { DashboardWithRelations } from '@/types/api/clients'
import { toUTC } from '../date'
import { GiveawayProductData, GroupedGiveawayData } from '@/types/api'
import { Option } from '@/types'

export function getActivationsHistory(
  dashboard: DashboardWithRelations,
): ActivationsHistoryTableData[] {
  return dashboard.submissions
    .map((submission) => {
      const velocity =
        submission.productSales.reduce((acc, sale) => acc + sale.quantity, 0) /
        4
      return {
        date: new Date(submission.startDate).toLocaleDateString('es-MX', {
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
        velocity: Number(velocity.toFixed(1)),
        conversionRate: Number(
          (
            (submission.totalQuantity / (submission.samplesDelivered || 1)) *
            100
          ).toFixed(1),
        ),
        time: new Date(submission.startDate),
      }
    })
    .sort((a, b) => b.time.getTime() - a.time.getTime())
}

function getTrafficRange(value: string): Range {
  if (value.toLocaleLowerCase().includes('muy alto')) return 'Muy Alto'
  if (value.toLocaleLowerCase().includes('alto')) return 'Alto'
  if (value.toLocaleLowerCase().includes('medio')) return 'Medio'
  if (value.toLocaleLowerCase().includes('muy bajo')) return 'Muy Bajo'
  if (value.toLocaleLowerCase().includes('bajo')) return 'Bajo'
  return 'Muy Bajo'
}

export function getTrafficDuringActivationChartData(
  dashboard: DashboardWithRelations,
): TrafficDuringActivationChartData[] {
  const trafficData = dashboard.submissions.reduce((acc, submission) => {
    const traffic = submission.sampling?.traffic
    if (!traffic) return acc
    const range = getTrafficRange(traffic.description)
    if (acc[range]) {
      acc[range] += 1
    } else {
      acc[range] = 1
    }
    return acc
  }, {} as Record<Range, number>)
  const trafficDataArray = Object.entries(
    trafficData,
  ).map<TrafficDuringActivationChartData>(([range, value]) => ({
    range: range as Range,
    value,
  }))
  return trafficDataArray.sort((a, b) => b.value - a.value)
}

export function getPromoterImagesData(
  dashboard: DashboardWithRelations,
): PromoterImageData[] {
  return dashboard.submissions
    .map((submission) => {
      return submission.photos
        .filter((photo) => photo.type.slug === PhotoTypesEnum.PROMOTOR)
        .map((photo) => ({
          url: photo.url,
          name: submission.representative?.name ?? '',
        }))
    })
    .flat()
}

export function getHeatmapData(
  dashboard: DashboardWithRelations,
): HeatmapDataStructure {
  const heatmapData: HeatmapDataActivationsStructure = {
    Lunes: Array(24)
      .fill(0)
      .map(() => []),
    Martes: Array(24)
      .fill(0)
      .map(() => []),
    Miércoles: Array(24)
      .fill(0)
      .map(() => []),
    Jueves: Array(24)
      .fill(0)
      .map(() => []),
    Viernes: Array(24)
      .fill(0)
      .map(() => []),
    Sábado: Array(24)
      .fill(0)
      .map(() => []),
    Domingo: Array(24)
      .fill(0)
      .map(() => []),
  }
  dashboard.submissions.forEach((submission) => {
    const startDate = toUTC(new Date(submission.startDate))
    const day = startDate.toLocaleString('es-MX', {
      weekday: 'long',
    })
    const dayCapitalized = day.charAt(0).toUpperCase() + day.slice(1)
    const dayKey = dayCapitalized as keyof HeatmapDataStructure
    let startHour = startDate.getHours()
    const endHour = startHour + 4
    const velocity = submission.totalQuantity / 4
    do {
      if (heatmapData[dayKey]) {
        heatmapData[dayKey][startHour].push(velocity)
      }
      startHour++
    } while (startHour < endHour && startHour < 24)
  })

  // Calcular el promedio de velocities por hora
  const averageHeatmapData: HeatmapDataStructure = {
    Lunes: [],
    Martes: [],
    Miércoles: [],
    Jueves: [],
    Viernes: [],
    Sábado: [],
    Domingo: [],
  }

  Object.entries(heatmapData).forEach(([day, hourVelocities]) => {
    averageHeatmapData[day as keyof HeatmapDataStructure] = Object.entries(
      hourVelocities,
    ).map(([_, velocities]) => {
      if (velocities.length > 0) {
        const sum = velocities.reduce(
          (acc: number, curr: number) => acc + curr,
          0,
        )
        return Number((sum / velocities.length).toFixed(2))
      }
      return 0
    })
  })

  return averageHeatmapData
}

export function getGiveawayProductsData(
  dashboard: DashboardWithRelations,
  giveawayProductTypes: Option[],
): GiveawayData[] {
  // Create basic map of giveaway product types
  const giveawayProductTypesMap = giveawayProductTypes.reduce<
    Record<string, { label: string; quantity: number }>
  >((acc, type) => {
    acc[type.value] = {
      label: type.label,
      quantity: 0,
    }
    return acc
  }, {})

  const allGiveawayProducts: GiveawayProductData[] =
    dashboard.submissions.flatMap((submission) =>
      submission.giveawayProducts.map((giveawayProduct) => ({
        type: giveawayProduct.giveawayProductType.name,
        quantity: giveawayProduct.quantity,
        submissionId: submission.id,
        submissionDate: submission.submittedAt,
      })),
    )

  allGiveawayProducts.forEach((product) => {
    const nameAsSlug = product.type.toLowerCase().replace(/ /g, '-')
    if (giveawayProductTypesMap[nameAsSlug]) {
      giveawayProductTypesMap[nameAsSlug].quantity += product.quantity
    }
  })

  return Object.entries(giveawayProductTypesMap)
    .map(([type, quantity]) => ({
      type: quantity.label,
      quantity: quantity.quantity,
    }))
    .sort((a, b) => b.quantity - a.quantity)
}
