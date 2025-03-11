import { ClientData } from '@/types/api'

export class ClientsApiService {
  static async getAll(): Promise<ClientData[]> {
    const response = await fetch('/api/clients')

    if (!response.ok) {
      throw new Error('Error al obtener los clientes')
    }

    return response.json()
  }
}
