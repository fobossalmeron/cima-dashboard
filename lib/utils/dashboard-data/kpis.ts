import { KpisData } from '@/components/general/general.types'
import { DashboardWithRelations } from '@/types/api/clients'

export function getKpisData(dashboard?: DashboardWithRelations): KpisData {
  if (!dashboard?.submissions) {
    return {
      activations: 0,
      locationsVisited: 0,
      samplesDelivered: 0,
      unitsSold: 0,
      conversion: 0,
      velocity: 0,
      nps: 0,
      followings: 0,
    }
  }

  // Conjunto de ubicaciones únicas visitadas
  const uniqueLocations = new Set(
    dashboard.submissions
      .filter((submission) => submission.location)
      .map((submission) => submission.location?.code),
  )

  // Calcular unidades totales vendidas
  const totalUnitsSold = dashboard.submissions.reduce(
    (total, submission) => total + (submission.totalQuantity || 0),
    0,
  )

  return {
    // Total de submissions
    activations: dashboard.submissions.length,
    // Total de ubicaciones únicas visitadas
    locationsVisited: uniqueLocations.size,
    // Total de unidades vendidas
    unitsSold: totalUnitsSold,
    // Estos valores requieren información adicional que no tenemos por ahora
    samplesDelivered: 0,
    conversion: 0,
    velocity: 0,
    nps: 0,
    followings: 0,
  }
}
