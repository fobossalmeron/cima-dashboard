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

export interface GiveawayData {
  type: string
  quantity: number
}

export interface PDVCoolerChartData {
  type: 'Con cooler' | 'Sin cooler'
  quantity: number
}

export interface CoolerSalesChartData {
  type: 'Con cooler' | 'Sin cooler'
  ventas: number
}

export interface CoolerTypesChartData {
  type: string
  quantity: number
}

export interface CoolerImageData {
  url: string
  name: string
}

// Material POP types
export interface PDVPOPChartData {
  type: 'Con POP' | 'Sin POP'
  quantity: number
}

export interface POPTypesChartData {
  type: string
  quantity: number
}

export interface POPImageData {
  url: string
  name: string
}

