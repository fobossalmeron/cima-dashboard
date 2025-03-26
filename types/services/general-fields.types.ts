import {
  Dealer,
  Location,
  PointOfSale,
  ProductLocation,
  Representative,
} from '@prisma/client'

export interface ProcessGeneralFieldsResult {
  dealer: Dealer
  representative: Representative
  location: Location
  pointOfSale: PointOfSale | null
  productLocation: ProductLocation | null
}
