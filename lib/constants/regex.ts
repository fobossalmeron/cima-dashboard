// Expresiones regulares para detectar presentaciones
export const PRESENTATION_PATTERNS = {
  PACK: /(\d+)\s*PACK\s+(?:TETRA|PET)?\s+(\d+(?:\.\d+)?)\s*(ml|fl\s+oz)/i,
  CAN: /CAN\s+(\d+(?:\.\d+)?)\s*(ml|fl\s+oz)/i,
  PET: /PET\s+(\d+(?:\.\d+)?)\s*(ml|fl\s+oz)/i,
  TETRA: /TETRA\s+(\d+(?:\.\d+)?)\s*(ml|fl\s+oz)/i,
  LITER: /(\d+)L|LITER/i,
  TETRATOP: /TETRATOP\s+(\d+(?:\.\d+)?)\s*(ml|fl\s+oz)/i,
  ULTRAEDGE: /ULTRAEDGE\s+(\d+(?:\.\d+)?)\s*(ml|fl\s+oz)/i,
  HALF_GALLON: /HALF\s+GALLON/i,
} as const

// Función para formatear la presentación
export function formatPresentation(
  container: keyof typeof PRESENTATION_PATTERNS,
  amount: string,
  unit?: string,
): string {
  const formats: Record<
    keyof typeof PRESENTATION_PATTERNS,
    (amount: string, unit?: string) => string
  > = {
    PACK: (amount, unit) => {
      // amount será el número de packs
      return `${amount}Pack TETRA ${unit || 'ml'}`
    },
    CAN: (amount, unit) => `CAN ${amount} ${unit || 'ml'}`,
    PET: (amount, unit) => `PET ${amount} ${unit || 'ml'}`,
    TETRA: (amount, unit) => `TETRA ${amount} ${unit || 'ml'}`,
    LITER: (amount) =>
      `${amount && parseFloat(amount) !== 1 ? `${amount}L` : 'L'}`,
    TETRATOP: (amount, unit) => `Tetratop ${amount} ${unit || 'ml'}`,
    ULTRAEDGE: (amount) => `Ultraedge ${amount}L`,
    HALF_GALLON: () => `Half gallon`,
  }

  return formats[container](amount, unit)
}

/**
 * Extracts the presentation name from the text
 * @param text - The text to extract the presentation name from
 * @returns The presentation name or null if it is not found
 */
export function getPresentationName(text?: string): string | null {
  if (!text) return null
  for (const [container, pattern] of Object.entries(PRESENTATION_PATTERNS)) {
    const match = text.match(pattern)
    if (match) {
      if (container === 'PACK') {
        return `${match[1]} ${container}`
      }
      return container
    }
  }
  return null
}

/**
 * Extracts the subbrand from the text
 * @param text - The text to extract the subbrand from
 * @returns The subbrand or null if it is not found
 */
export function extractSubBrand(text: string): string | null {
  // Remove multiple spaces and trim
  const cleanText = text.replace(/\s+/g, ' ').trim()

  // If the text is empty, return "Sin submarca"
  if (!cleanText) return null

  // Capitalize each word
  return cleanText
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}
