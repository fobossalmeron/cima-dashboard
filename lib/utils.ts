import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { FormSubmissionEntryData } from '@/types/api'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
}

export function capitalizeWords(text: string) {
  return text
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Groups an array of items by a given key
 * @template T - The type of the items to group
 * @template K - The type of the grouped items
 * @param array - The array to group
 * @param key - The key to group by
 * @returns A record of grouped items
 */
export function groupBy<T, K extends { key: string; items: T[] }>(
  array: T[],
  key: keyof T,
) {
  return array.reduce((acc, item) => {
    const groupKey = String(item[key])
    if (!acc[groupKey]) {
      acc[groupKey] = {
        key: groupKey,
        items: [] as T[],
      } as K
    }
    acc[groupKey].items.push(item)
    return acc
  }, {} as Record<string, K>)
}

/**
 * Extrae el primer número de un texto que puede contener un rango (ej: "1-5" o "1")
 * @param text - El texto a procesar
 * @returns El primer número encontrado o null si no hay números
 */
export function extractNumber(text: string | number | null): number | null {
  if (!text) return null
  const textString = text.toString()
  const match = textString.match(/^(\d+)(?:\s*-\s*)?/)
  return match ? Number(match[1]) : null
}

/**
 * Transforma los datos de un job a FormSubmissionEntryData
 * @param data - Los datos del job
 * @returns Los datos transformados en formato FormSubmissionEntryData
 */
export function transformJobData(
  data: Record<string, unknown>,
): FormSubmissionEntryData {
  return Object.entries(data).reduce((acc, [key, value]) => {
    // Ignorar campos especiales que no son respuestas
    if (key === 'Código de localidad' || key === 'Enlace al formulario') {
      return acc
    }
    // Asegurar que el valor sea string, number o null
    acc[key] =
      typeof value === 'string' || typeof value === 'number' || value === null
        ? value
        : value?.toString() || null
    return acc
  }, {} as FormSubmissionEntryData)
}
