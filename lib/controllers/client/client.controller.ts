import { ClientsService } from '@/lib/services'
import { NextRequest, NextResponse } from 'next/server'

export class ClientController {
  static async create(request: NextRequest) {
    const { name, slug } = await request.json()

    try {
      const result = await ClientsService.create({ name, slug })
      return NextResponse.json(result)
    } catch (error) {
      console.error('Error al crear el cliente:', error)
      return NextResponse.json(
        { error: `Error al crear el cliente: ${error}` },
        { status: 500 },
      )
    }
  }
}
