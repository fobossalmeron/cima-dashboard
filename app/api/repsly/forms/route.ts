import { NextRequest, NextResponse } from 'next/server'
import { FormSearchResponse } from '@/types/dashboard'
import { RepslyFormTemplatesController } from '@/lib/controllers'

export async function POST(
  request: NextRequest,
): Promise<NextResponse<FormSearchResponse>> {
  return RepslyFormTemplatesController.search(request)
}
