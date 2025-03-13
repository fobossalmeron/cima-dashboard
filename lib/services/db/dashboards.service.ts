import {
  DashboardResponse,
  DashboardWithClientAndTemplate,
} from '@/types/api/dashboard'

export class DashboardsService {
  static async getAll(): Promise<DashboardWithClientAndTemplate[]> {
    const dashboards = await fetch('/api/dashboards')
    if (!dashboards.ok) {
      throw new Error('Error al obtener dashboards')
    }
    const data: DashboardResponse = await dashboards.json()
    if (data.error === null) {
      return data.data
    } else {
      throw new Error(`Error al obtener dashboards: ${data.error}`)
    }
  }
}
