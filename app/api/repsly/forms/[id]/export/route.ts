import { NextResponse } from 'next/server'
import { parse } from 'csv-parse/sync'
import {
  SyncDashboardErrorResponse,
  SyncDashboardResponse,
  SyncDashboardSuccessResponse,
} from '@/types/api'
import { RepslyApiService } from '@/lib/services/api/repsly.service'
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
  _: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<SyncDashboardResponse>> {
  try {
    const { id } = await params

    const csvText = await RepslyApiService.exportForm(id)

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
  } catch (error) {
    console.error('Error al buscar formularios:', error)
    return NextResponse.json<SyncDashboardErrorResponse>(
      {
        status: ApiStatus.ERROR,
        error:
          error instanceof Error
            ? error.message
            : 'Error al buscar formularios',
        data: null,
      },
      { status: 500 },
    )
  }
}
