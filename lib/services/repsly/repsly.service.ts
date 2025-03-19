import {
  ApiResponse,
  FormTemplateResponse,
  ImportProductsResponse,
  SyncDashboardResponse,
} from '@/types/api'
import { FormSearchResponse } from '@/types/dashboard'
import { RepslyAuthService } from './repsly-auth.service'

export class RepslyService {
  static async searchForms(
    searchTerm: string = '',
  ): Promise<ApiResponse<FormSearchResponse>> {
    return RepslyAuthService.makeAuthenticatedRequest<FormSearchResponse>(
      '/api/repsly/forms',
      {
        method: 'POST',
        body: JSON.stringify({ searchTerm }),
      },
    )
  }

  static async getFormTemplate(
    id: string,
  ): Promise<ApiResponse<FormTemplateResponse>> {
    return RepslyAuthService.makeAuthenticatedRequest<FormTemplateResponse>(
      `/api/repsly/forms/${id}`,
      {
        method: 'GET',
      },
    )
  }

  static async importProducts(): Promise<ApiResponse<ImportProductsResponse>> {
    return RepslyAuthService.makeAuthenticatedRequest<ImportProductsResponse>(
      '/api/repsly/products/import',
      {
        method: 'POST',
      },
    )
  }

  static async exportForm(id: string): Promise<ApiResponse<string>> {
    const exportUrl = process.env.REPSLY_EXPORT_URL ?? ''

    const currentDate = new Date()
    const dateBegin = new Date(new Date().setDate(currentDate.getDate() - 120))
    const headers = {
      Accept: 'text/plain,text/csv',
      'Accept-Encoding': 'identity',
    }
    const body = {
      DateBegin: dateBegin.toISOString().split('T')[0],
      DateEnd: currentDate.toISOString().split('T')[0],
      ExportType: 'csv',
      ShowClientExtraInfo: true,
      UniDocZagRowID: id,
    }

    return RepslyAuthService.makeAuthenticatedRequest<string>(exportUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
  }

  static async syncDashboard(
    id: string,
  ): Promise<ApiResponse<SyncDashboardResponse>> {
    return RepslyAuthService.makeAuthenticatedRequest<SyncDashboardResponse>(
      `/api/repsly/forms/${id}/export`,
      {
        method: 'GET',
      },
    )
  }
}
