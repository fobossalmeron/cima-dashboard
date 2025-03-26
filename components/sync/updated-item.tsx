import { RowTransactionUpdatedResult } from '@/types/api'
import { Badge } from '../ui/badge'
import { formatDate } from '@/lib/utils/date'

export function UpdatedItem({
  submission,
}: {
  submission: RowTransactionUpdatedResult
}) {
  return (
    <div
      key={submission.rowIndex}
      className="mb-4 p-3 bg-yellow-50/50 border border-yellow-500 rounded-lg"
    >
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="outline" className="bg-yellow-50 border-yellow-500">
          Registro {submission.rowIndex + 1}
        </Badge>
      </div>
      <div className="text-sm space-y-1">
        <p>
          <span className="font-medium">Código de Localidad:</span>{' '}
          {submission.submission.locationId}
        </p>
        <p>
          <span className="font-medium">Código de Representante:</span>{' '}
          {submission.submission.representativeId}
        </p>
        <p>
          <span className="font-medium">Fecha:</span>{' '}
          {formatDate(submission.submission.submittedAt)}
        </p>
      </div>
    </div>
  )
}
