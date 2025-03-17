/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import {
  FormSearchRequest,
  FormSearchResponse,
  SearchOperator,
  SearchType,
} from '@/types/dashboard'
import { FormTemplateSearchResponse } from '@/types/api'
import { RepslyAuthService } from '@/lib/services/repsly/repsly-auth.service'

const REPSLY_API_URL = process.env.REPSLY_API_URL

export async function POST(
  request: Request,
): Promise<NextResponse<FormSearchResponse>> {
  try {
    const { search } = await request.json()
    const { token, fingerprint } = await RepslyAuthService.getToken()

    const requestBody: FormSearchRequest = {
      Skip: 0,
      Limit: 10,
      Elements: [
        {
          Operator: SearchOperator.Is,
          Type: SearchType.IsActive,
          Value: true,
        },
        ...(search
          ? [
              {
                Operator: SearchOperator.Contains,
                Type: SearchType.Search,
                Value: search,
              },
            ]
          : []),
      ],
      SortField: 'LastUpdatedUtc',
      SortDescending: true,
    }

    const response = await fetch(`${REPSLY_API_URL}/Template/List`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Fingerprint: fingerprint ?? '',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      throw new Error(`Error al buscar formularios: ${response.statusText}`)
    }

    const data = await response.json()
    const items = (data as any[]).map(
      (item): FormTemplateSearchResponse => ({
        id: item.Id,
        name: item.Name,
        description: item.Description,
        active: item.Active,
        sortOrder: item.SortOrder,
        version: item.Version,
        createdAt: item.CreatedAt,
        updatedAt: item.UpdatedAt,
        createdBy: item.CreatedBy,
        updatedBy: item.UpdatedBy,
      }),
    )
    const total = items.length
    return NextResponse.json({
      data: { items, total },
    })
  } catch (error) {
    console.error('Error al buscar formularios:', error)

    return NextResponse.json(
      { error: 'Error al buscar formularios' },
      { status: 500 },
    )
  }
}
