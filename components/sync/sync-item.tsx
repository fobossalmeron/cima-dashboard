import { ValidationResult } from '@/types/api'
import { Badge } from '../ui/badge'
import { formatDate } from '@/lib/utils/date'

interface SyncItemProps {
  index: number
  submission: ValidationResult['validSubmissions'][number]
}

export function SyncItem({ index, submission }: SyncItemProps) {
  return (
    <div key={index} className="mb-4 p-3 bg-green-50/50 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="outline" className="bg-green-50">
          Registro {index + 1}
        </Badge>
      </div>
      <div className="text-sm space-y-1">
        <p>
          <span className="font-medium">Representante:</span>{' '}
          {submission.representative.name}
        </p>
        <p>
          <span className="font-medium">Ubicación:</span>{' '}
          {submission.location.name}
        </p>
        <p>
          <span className="font-medium">Distribuidor:</span>{' '}
          {submission.dealer.name}
        </p>
        <p>
          <span className="font-medium">Fecha:</span>{' '}
          {formatDate(submission.submission.submittedAt)}
        </p>
      </div>
    </div>
  )
}
