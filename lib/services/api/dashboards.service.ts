import { DashboardWithClientAndTemplate } from '@/types/api'

export class DashboardsApiService {
  static async getAll(): Promise<DashboardWithClientAndTemplate[]> {
    const response = await fetch('/api/dashboards')

    if (!response.ok) {
      throw new Error('Error al obtener los dashboards')
    }

    const data = await response.json()
    return data.data
  }
}
