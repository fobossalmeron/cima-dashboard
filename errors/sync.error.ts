import { RowTransactionErrorResult } from '@/types/api'

export class SyncError extends Error {
  constructor(
    message: string,
    public readonly errors: RowTransactionErrorResult['errors'],
    public readonly rowIndex: number,
  ) {
    super(message)
    this.name = 'SyncError'
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      errors: this.errors,
      rowIndex: this.rowIndex,
    }
  }
}
