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

/**
 * Calcula la distancia de Levenshtein entre dos cadenas
 * @param str1 - Primera cadena
 * @param str2 - Segunda cadena
 * @returns Número de operaciones necesarias para transformar una cadena en otra
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length
  const n = str2.length
  const dp: number[][] = Array(m + 1)
    .fill(0)
    .map(() => Array(n + 1).fill(0))

  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j - 1] + 1, // sustitución
          dp[i - 1][j] + 1, // eliminación
          dp[i][j - 1] + 1, // inserción
        )
      }
    }
  }

  return dp[m][n]
}

/**
 * Calcula la similitud entre dos cadenas de texto usando la distancia de Levenshtein
 * @param str1 - Primera cadena a comparar
 * @param str2 - Segunda cadena a comparar
 * @returns Un número entre 0 y 1, donde 1 es una coincidencia perfecta
 */
export function calculateStringSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim()
  const s2 = str2.toLowerCase().trim()

  // Si las cadenas son idénticas
  if (s1 === s2) return 1

  // Si una cadena está contenida en la otra
  if (s1.includes(s2) || s2.includes(s1)) return 0.9

  // Calcular la distancia de Levenshtein
  const distance = levenshteinDistance(s1, s2)

  // Calcular la longitud máxima de las cadenas
  const maxLength = Math.max(s1.length, s2.length)

  // Calcular la similitud (1 - distancia normalizada)
  const similarity = 1 - distance / maxLength

  // Ajustar la similitud para que sea más sensible a diferencias pequeñas
  return Math.pow(similarity, 2)
}
