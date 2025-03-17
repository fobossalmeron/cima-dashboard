import {
  DashboardWithClientAndTemplate,
  FormSubmissionEntryData,
  SyncResponseBody,
} from '@/types/api'

export class DashboardsApiService {
  static async getAll(): Promise<DashboardWithClientAndTemplate[]> {
    const response = await fetch('/api/dashboards')

    if (!response.ok) {
      throw new Error('Error al obtener los dashboards')
    }

    const data = await response.json()
    return data.data
  }

  static async sync(
    dashboardId: string,
    formData: FormSubmissionEntryData[],
  ): Promise<SyncResponseBody> {
    const response = await fetch(`/api/dashboards/${dashboardId}/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formData }),
    })

    if (!response.ok) {
      throw new Error('Error al sincronizar el dashboard')
    }

    const data = await response.json()
    return data as SyncResponseBody
  }
}
