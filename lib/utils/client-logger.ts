type LogMetadata = Record<string, unknown>

// Logger simple para el cliente que usa console
export const logger = {
  info: (message: string, meta?: LogMetadata) => {
    console.info(`[INFO]: ${message}`, meta || '')
  },
  error: (message: string, meta?: LogMetadata) => {
    console.error(`[ERROR]: ${message}`, meta || '')
  },
  warn: (message: string, meta?: LogMetadata) => {
    console.warn(`[WARN]: ${message}`, meta || '')
  },
  debug: (message: string, meta?: LogMetadata) => {
    console.debug(`[DEBUG]: ${message}`, meta || '')
  },
}
