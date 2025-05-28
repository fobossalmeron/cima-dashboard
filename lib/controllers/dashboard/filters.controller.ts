import { LocationRepository } from '@/lib/repositories'
import { ActivatedBrandService } from '@/lib/services'
import { NextRequest } from 'next/server'

export class FiltersController {
  static async getFilters(request: NextRequest, params: { id: string }) {
    const { id } = params
    const brands = await ActivatedBrandService.getByDashboardId(id)
    const locations = await LocationRepository.getAll({
      dashboardId: id,
    })
    const cities = await LocationRepository.getUniqueCities({
      dashboardId: id,
    })

    return {
      brands,
      locations,
      cities,
    }
  }
}
