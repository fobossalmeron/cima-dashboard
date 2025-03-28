import {
  Client,
  Dashboard,
  FormTemplate,
  SyncJob,
  SyncLog,
} from '@prisma/client'

export type DashboardWithClientAndTemplate = Dashboard & {
  client: Client
  template: FormTemplate
  SyncJob: SyncJob[]
}

export interface DashboardWithLogs extends Dashboard {
  syncLogs: SyncLog[]
  client: Client
}

export interface DashboardSuccessResponse {
  data: DashboardWithClientAndTemplate[]
  error: null
}

export interface DashboardErrorResponse {
  data?: null
  error: string
}

export type DashboardResponse =
  | DashboardSuccessResponse
  | DashboardErrorResponse
