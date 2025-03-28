import { logger } from './logger'

const isDevelopment = process.env.ENVIRONMENT === 'development'

type LogLevel = 'info' | 'error' | 'warn' | 'debug'

interface LogOptions {
  message: string
  meta?: Record<string, unknown>
  level?: LogLevel
}

class Log {
  private static log({ message, meta, level = 'info' }: LogOptions) {
    if (isDevelopment) {
      // En desarrollo, usar el logger configurado
      logger[level](message, meta)
    } else {
      // En producción, usar console.log
      const prefix = `[${level.toUpperCase()}]`
      console.log(prefix, message, meta || '')
    }
  }

  static info(message: string, meta?: Record<string, unknown>) {
    this.log({ message, meta, level: 'info' })
  }

  static error(message: string, meta?: Record<string, unknown>) {
    this.log({ message, meta, level: 'error' })
  }

  static warn(message: string, meta?: Record<string, unknown>) {
    this.log({ message, meta, level: 'warn' })
  }

  static debug(message: string, meta?: Record<string, unknown>) {
    this.log({ message, meta, level: 'debug' })
  }
}

export { Log }
