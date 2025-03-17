export function parseDate(dateString: string): Date {
  // Formato esperado: DD/MM/YYYY HH:mm:ss
  const [datePart, timePart] = dateString.split(' ')
  const [day, month, year] = datePart.split('/')
  const [hours, minutes, seconds] = timePart.split(':')

  return new Date(
    parseInt(year),
    parseInt(month) - 1, // Los meses en JavaScript son 0-based
    parseInt(day),
    parseInt(hours),
    parseInt(minutes),
    parseInt(seconds),
  )
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
