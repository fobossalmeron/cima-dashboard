import { RowTransactionErrorResult } from '@/types/api'
import { Alert, AlertDescription } from '../ui/alert'
import { AlertCircle } from 'lucide-react'
import { Badge } from '../ui/badge'

export function ErrorItem({ error }: { error: RowTransactionErrorResult }) {
  return (
    <Alert key={error.rowIndex} variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <div className="mb-2">
          <Badge variant="outline" className="bg-red-50">
            Fila {error.rowIndex}
          </Badge>
        </div>
        <ul className="list-disc list-inside space-y-1 text-sm">
          {error.errors.map((error, errorIndex) => (
            <li key={errorIndex}>
              <span className="font-medium">{error.column}:</span> {error.error}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  )
}
