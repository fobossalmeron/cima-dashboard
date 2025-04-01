import { InvalidDateError } from '@/errors'

export enum DateFormat {
  DD_MM_YYYY = 'DD/MM/YYYY',
  YYYY_MM_DD = 'YYYY-MM-DD',
}

/**
 * Convierte una fecha a UTC manteniendo la hora local
 * @param date Fecha a convertir
 * @returns Fecha en UTC
 */
export function toUTC(date: Date): Date {
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() + offset * 60000)
}

/**
 * Convierte una fecha UTC a fecha local
 * @param date Fecha UTC a convertir
 * @returns Fecha en zona horaria local
 */
export function fromUTC(date: Date): Date {
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60000)
}

/**
 * Parsea una fecha string a un objeto Date en UTC
 * @param dateString String de fecha a parsear
 * @param format Formato de la fecha
 * @returns Fecha en UTC
 */
export function parseDate(
  dateString: string,
  format: DateFormat = DateFormat.DD_MM_YYYY,
): Date {
  try {
    const [datePart, timePart] = dateString.split(' ')
    const [hours, minutes] = timePart?.split(':') || ['00', '00']

    let day: string
    let month: string
    let year: string

    switch (format) {
      case DateFormat.DD_MM_YYYY:
        ;[day, month, year] = datePart.split('/')
        break
      case DateFormat.YYYY_MM_DD:
        ;[year, month, day] = datePart.split('-')
        break
      default:
        throw new InvalidDateError(
          `Formato de fecha no soportado: ${format}. Formatos soportados: ${Object.values(
            DateFormat,
          ).join(', ')}`,
        )
    }

    // Creamos la fecha directamente en UTC
    return new Date(
      Date.UTC(
        parseInt(year),
        parseInt(month) - 1, // Los meses en JavaScript son 0-based
        parseInt(day),
        parseInt(hours),
        parseInt(minutes),
        0,
      ),
    )
  } catch {
    throw new InvalidDateError(
      `Formato de fecha inválido: ${dateString}. Formato esperado: ${format} HH:mm`,
    )
  }
}

/**
 * Formatea una fecha a string con formato local
 * @param date Fecha a formatear
 * @returns String de fecha formateada
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleString(new Intl.Locale('es-MX'), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Formatea una fecha a string en formato ISO
 * @param date Fecha a formatear
 * @returns String de fecha en formato ISO
 */
export function formatDateISO(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toISOString()
}
