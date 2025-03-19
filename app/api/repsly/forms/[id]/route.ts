import { NextRequest } from 'next/server'
import { RepslyFormTemplatesController } from '@/lib/controllers'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const paramsResolved = await params
  return RepslyFormTemplatesController.getFromId(request, paramsResolved)
}
