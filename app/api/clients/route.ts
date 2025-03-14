import { NextResponse } from 'next/server'
import { ClientsService } from '@/lib/services/db'

export async function GET() {
  console.log('Iniciando GET /api/clients')

  try {
    const clients = await ClientsService.getAll()

    return NextResponse.json(clients)
  } catch (error) {
    console.error('Error detallado al obtener clientes:', error)

    // Si el error es específicamente sobre el proveedor no encontrado
    if (error instanceof Error && error.message.includes('No provider found')) {
      return NextResponse.json(
        { error: 'Error de inicialización del servicio' },
        { status: 503 },
      )
    }

    return NextResponse.json(
      { error: 'Error al obtener clientes' },
      { status: 500 },
    )
  }
}
