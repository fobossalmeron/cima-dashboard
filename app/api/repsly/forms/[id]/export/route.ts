import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'csv-parse/sync'
import {
  SyncDashboardErrorResponse,
  SyncDashboardErrorResponseType,
  SyncDashboardResponse,
  SyncDashboardSuccessResponse,
} from '@/types/api'
import { RepslyApiService } from '@/lib/services/api'
import { ApiStatus } from '@/enums/api-status'

interface RepslyExportData {
  [key: string]: string | number | null
}

function detectDelimiter(csvText: string): string {
  const firstLine = csvText.split('\n')[0]
  const commaCount = (firstLine.match(/,/g) || []).length
  const semicolonCount = (firstLine.match(/;/g) || []).length

  return semicolonCount > commaCount ? ';' : ','
}

function parseCSV(csv: string): RepslyExportData[] {
  try {
    const delimiter = detectDelimiter(csv)

    const records = parse(csv, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true,
      delimiter,
      quote: '"',
      escape: '"',
      relaxQuotes: true,
      relaxColumnCount: true,
      skipRecordsWithError: true,
      cast: (value) => {
        if (value === '' || value === undefined) {
          return null
        }
        const number = Number(value)
        return isNaN(number) ? value : number
      },
    })

    return records as RepslyExportData[]
  } catch (error) {
    console.error('Error parsing CSV:', error)
    throw error
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<SyncDashboardResponse>> {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const start = searchParams.get('start')
    const end = searchParams.get('end')

    const csvText = await RepslyApiService.exportForm(id, start, end)

    // Verificar que tenemos datos
    if (!csvText || csvText.trim().length === 0) {
      throw new Error('La respuesta del CSV está vacía')
    }

    // Convertir CSV a JSON usando csv-parse
    const jsonData = parseCSV(csvText)

    return NextResponse.json<SyncDashboardSuccessResponse>({
      status: ApiStatus.SUCCESS,
      data: jsonData,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const body: SyncDashboardErrorResponse = {
      status: ApiStatus.ERROR,
      type: (error.name ?? error.type) as SyncDashboardErrorResponseType,
      error: error.message,
      data: null,
      statusCode: error.statusCode,
    }
    return NextResponse.json<SyncDashboardErrorResponse>(body, {
      status: error.statusCode,
    })
  }
}
