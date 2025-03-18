import { Client, Dashboard, User } from '@prisma/client'

export interface CreateClientRequest {
  name: string
  slug: string
}

export interface CreateClientResponse {
  user: User
  client: Client
}

export interface ClientWithRelations extends Client {
  user: Pick<User, 'name' | 'email'>
  dashboard: Dashboard | null
}

export interface GetClientBySlugWithDashboardResponse {
  client: ClientWithRelations
}
