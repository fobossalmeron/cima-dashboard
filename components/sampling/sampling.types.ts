export type WeekDay =
  | 'Lunes'
  | 'Martes'
  | 'Miércoles'
  | 'Jueves'
  | 'Viernes'
  | 'Sábado'
  | 'Domingo'

export type HeatmapDataStructure = Record<
  WeekDay,
  {
    [hour: number]: number
  }
>

export type HeatmapDataActivationsStructure = Record<
  WeekDay,
  {
    [hour: number]: number[]
  }
>

export type Range = 'Medio' | 'Bajo' | 'Muy Bajo' | 'Alto' | 'Muy Alto'

export interface TrafficDuringActivationChartData {
  range: Range
  value: number
}

export interface ActivationsHistoryTableData {
  date: string
  brand: string
  locationName: string
  address: string
  sales: number
  velocity: number
  conversionRate: number
}

export interface PromoterImageData {
  url: string
  name: string
}
