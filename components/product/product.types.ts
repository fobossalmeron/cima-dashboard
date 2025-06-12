export interface ProductStatusInPDVChartData {
  type: 'En promoción' | 'Precio regular'
  quantity: number
}
export interface ProductLocationInPDVChartData {
  location: string
  quantity: number
}

export interface PDVTypeChartData {
  type: string
  quantity: number
}

export interface PDVProductImagesData {
  locationName: string
  address: string
  url: string
}
export interface OldAndNewActivationsChartData {
  month: string
  new_location_activations: number
  previous_location_activations: number
  new_locations: number
  previous_locations: number
  previousLocations: string[]
  newLocations: string[]
}

export interface AveragePriceInPDVChartData {
  brand: string
  averagePriceByPdvType: {
    [key: string]: number // Clave es el tipo de PDV, valor es el precio
  }
}

export interface CoolerRecord {
  type: 'Con cooler' | 'Sin cooler'
  quantity: number
}

export type CoolerData = CoolerRecord[]

export interface CoolerSalesRecord {
  type: 'Con cooler' | 'Sin cooler'
  ventas: number
}

export type CoolerSalesData = CoolerSalesRecord[]

export interface CoolerTypesRecord {
  type: string
  quantity: number
}

export interface CoolerTypesData {
  type: string
  quantity: number
}

export interface PopRecord {
  type: 'Con POP' | 'Sin POP'
  quantity: number
}

export type PopData = PopRecord[]

export interface PopTypesRecord {
  type: string
  quantity: number
}

export interface CoolerImageData {
  url: string
  name: string
}
