import { ActivatedBrandService, LocationService } from '@/lib/services'
import { NextRequest } from 'next/server'

export class FiltersController {
  static async getFilters(request: NextRequest, params: { id: string }) {
    const { id } = params
    const brands = await ActivatedBrandService.getByDashboardId(id)
    const locations = await LocationService.getAll()
    const cities = await LocationService.getUniqueCities()

    return {
      brands,
      locations,
      cities,
    }
  }
}
