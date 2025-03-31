import { InvalidDateError } from '@/errors'

export enum DateFormat {
  DD_MM_YYYY = 'DD/MM/YYYY',
  YYYY_MM_DD = 'YYYY-MM-DD',
}

export function parseDate(
  dateString: string,
  format: DateFormat = DateFormat.DD_MM_YYYY,
): Date {
  try {
    const [datePart, timePart] = dateString.split(' ')
    const [hours, minutes, seconds] = timePart?.split(':') || ['00', '00', '00']

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

    return new Date(
      parseInt(year),
      parseInt(month) - 1, // Los meses en JavaScript son 0-based
      parseInt(day),
      parseInt(hours),
      parseInt(minutes),
      parseInt(seconds),
    )
  } catch {
    throw new InvalidDateError(
      `Formato de fecha inválido: ${dateString}. Formato esperado: ${format} HH:mm:ss`,
    )
  }
}

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
