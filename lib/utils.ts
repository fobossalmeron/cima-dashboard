import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

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
