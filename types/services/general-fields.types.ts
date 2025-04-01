import { Dealer, Location, PointOfSale, Representative } from '@prisma/client'

export interface ProcessGeneralFieldsResult {
  dealer: Dealer
  representative: Representative
  location: Location
  pointOfSale: PointOfSale | null
}
