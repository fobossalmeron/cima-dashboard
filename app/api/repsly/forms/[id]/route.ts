import { NextResponse } from 'next/server'
import { FormTemplateResponse } from '@/types/api'
import { RepslyAuthService } from '@/lib/services/repsly/repsly-auth.service'

const REPSLY_API_URL = process.env.REPSLY_API_URL

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<FormTemplateResponse>> {
  try {
    const { token, fingerprint } = await RepslyAuthService.getToken()
    const { id } = await params
    const response = await fetch(`${REPSLY_API_URL}/Template/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Fingerprint: fingerprint ?? '',
      },
    })

    if (!response.ok) {
      throw new Error(`Error al buscar formulario: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json({
      data,
    })
  } catch (error) {
    console.error('Error al buscar formularios:', error)
    return NextResponse.json(
      { error: 'Error al buscar formularios' },
      { status: 500 },
    )
  }
}
