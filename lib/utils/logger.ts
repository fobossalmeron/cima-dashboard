type LoggerType = {
  info: (message: string, meta?: Record<string, unknown>) => void
  error: (message: string, meta?: Record<string, unknown>) => void
  warn: (message: string, meta?: Record<string, unknown>) => void
  debug: (message: string, meta?: Record<string, unknown>) => void
}

// Logger temporal mientras se carga el logger real
const tempLogger: LoggerType = {
  info: (message: string, meta?: Record<string, unknown>) => {
    console.info(`[INFO]: ${message}`, meta || '')
  },
  error: (message: string, meta?: Record<string, unknown>) => {
    console.error(`[ERROR]: ${message}`, meta || '')
  },
  warn: (message: string, meta?: Record<string, unknown>) => {
    console.warn(`[WARN]: ${message}`, meta || '')
  },
  debug: (message: string, meta?: Record<string, unknown>) => {
    console.debug(`[DEBUG]: ${message}`, meta || '')
  },
}

// Exportar una versión proxy del logger que se actualizará cuando se cargue el logger real
export const logger = new Proxy(tempLogger, {
  get(target, prop: keyof LoggerType) {
    if (typeof window === 'undefined') {
      // En el servidor, cargar el logger del servidor
      return (message: string, meta?: Record<string, unknown>) => {
        import('./server-logger').then(({ logger: serverLogger }) => {
          if (prop in serverLogger) {
            serverLogger[prop](message, meta)
          }
        })
      }
    } else {
      // En el cliente, usar el logger temporal
      return target[prop]
    }
  },
})
