import { KpisData } from '@/components/general/general.types'
import { DashboardWithRelations } from '@/types/api/clients'
import {
  getNetPromoterScoreChartData,
  getRealNetPromoterScores,
} from './consumer'

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
  const unitsSold = dashboard.submissions.reduce(
    (total, submission) => total + (submission.totalQuantity || 0),
    0,
  )

  const samplesDelivered = dashboard.submissions.reduce(
    (total, submission) => total + (submission.samplesDelivered || 0),
    0,
  )

  const conversion = (unitsSold / (samplesDelivered || 1)) * 100

  const velocity =
    dashboard.submissions
      .map((submission) => submission.totalQuantity / 4)
      .reduce((total, current) => total + current, 0) /
    (dashboard.submissions.length || 1)

  const followings = dashboard.submissions.reduce(
    (total, submission) => total + (submission.sampling?.followUp ? 1 : 0),
    0,
  )

  const { realNps } = getRealNetPromoterScores(
    getNetPromoterScoreChartData(dashboard),
  )

  return {
    activations: dashboard.submissions.length,
    locationsVisited: uniqueLocations.size,
    unitsSold,
    samplesDelivered,
    conversion: Number(conversion.toFixed(2)),
    velocity: Number(velocity.toFixed(2)),
    nps: Number(realNps.toFixed(2)),
    followings,
  }
}
