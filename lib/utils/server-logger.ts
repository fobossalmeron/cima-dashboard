import winston from 'winston'
import path from 'path'
import fs from 'fs/promises'

// Función para generar el nombre del archivo con timestamp
function getLogFileName(baseFileName: string): string {
  const now = new Date()
  const timestamp = now
    .toISOString()
    .replace(/[:.]/g, '-') // Reemplazar : y . con -
    .replace('T', '_') // Reemplazar T con _
    .slice(0, -1) // Remover la Z del final
  return path.join(process.cwd(), 'logs', `${baseFileName}-${timestamp}.log`)
}

// Configurar el formato de los logs
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message, ...rest }) => {
    const metadata = Object.keys(rest).length
      ? `\n${JSON.stringify(rest, null, 2)}`
      : ''
    return `${timestamp} [${level.toUpperCase()}]: ${message}${metadata}`
  }),
)

// Crear el logger del servidor
export const logger = winston.createLogger({
  format: logFormat,
  transports: [
    // Escribir logs de error
    new winston.transports.File({
      filename: getLogFileName('error'),
      level: 'error',
    }),
    // Escribir logs de sincronización
    new winston.transports.File({
      filename: getLogFileName('sync'),
      level: 'info',
    }),
    // Escribir logs combinados
    new winston.transports.File({
      filename: getLogFileName('combined'),
    }),
    // Mostrar logs en la consola en desarrollo
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
})

// Función para limpiar logs antiguos (mantener solo los últimos 7 días)
async function cleanOldLogs() {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  try {
    const logsDir = path.join(process.cwd(), 'logs')
    const files = await fs.readdir(logsDir)

    for (const file of files) {
      const filePath = path.join(logsDir, file)
      const stats = await fs.stat(filePath)

      if (stats.mtime < sevenDaysAgo) {
        await fs.unlink(filePath)
        logger.info(`Archivo de log antiguo eliminado: ${file}`)
      }
    }
  } catch (error) {
    logger.error('Error limpiando logs antiguos:', { error })
  }
}

// Limpiar logs antiguos al iniciar y cada 24 horas
cleanOldLogs()
setInterval(cleanOldLogs, 24 * 60 * 60 * 1000)
