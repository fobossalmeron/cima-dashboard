/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { ServiceToken } from '@prisma/client'
import { FormTemplateResponse } from '@/types/api'

const REPSLY_API_URL = process.env.REPSLY_API_URL

async function getRepslyToken(): Promise<ServiceToken> {
  const token = await prisma.serviceToken.findUnique({
    where: { service: 'repsly' },
  })

  if (!token) {
    throw new Error('No se encontró el token de Repsly')
  }

  return token
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<FormTemplateResponse>> {
  try {
    const { token, fingerprint } = await getRepslyToken()
    const { id } = await params
    const response = await fetch(`${REPSLY_API_URL}/Template/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Fingerprint: fingerprint,
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
