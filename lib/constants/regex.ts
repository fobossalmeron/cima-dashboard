// Expresiones regulares para detectar presentaciones
export const PRESENTATION_PATTERNS = {
  PACK: /(\d+)\s*PACK\s+(?:TETRA|PET)?\s+(\d+(?:\.\d+)?)\s*(?:ml|fl\s+oz)/i,
  CAN: /CAN\s+(\d+(?:\.\d+)?)\s*(?:ml|fl\s+oz)/i,
  PET: /PET\s+(\d+(?:\.\d+)?)\s*(?:ml|fl\s+oz)/i,
  TETRA: /TETRA\s+(\d+(?:\.\d+)?)\s*(?:ml|fl\s+oz)/i,
  LITER: /(\d+)L|LITER/i,
  TETRATOP: /TETRATOP\s+(\d+(?:\.\d+)?)\s*(?:ml|fl\s+oz)/i,
  ULTRAEDGE: /ULTRAEDGE\s+(\d+(?:\.\d+)?)\s*(?:ml|fl\s+oz)/i,
  HALF_GALLON: /HALF\s+GALLON/i,
} as const

// Función para formatear la presentación
export function formatPresentation(
  container: keyof typeof PRESENTATION_PATTERNS,
  amount: string,
): string {
  const formats: Record<
    keyof typeof PRESENTATION_PATTERNS,
    (amount: string) => string
  > = {
    PACK: (amount) => {
      // amount será "3,200" donde 3 es la cantidad de elementos y 200 es ml
      const [quantity, size] = amount.split(',')
      return `${quantity}Pack TETRA ${size}ml`
    },
    CAN: (amount) => `CAN ${amount}ml`,
    PET: (amount) => `PET ${amount}ml`,
    TETRA: (amount) => `TETRA ${amount}ml`,
    LITER: (amount) =>
      `${amount && parseFloat(amount) !== 1 ? `${amount}L` : 'L'}`,
    TETRATOP: (amount) => `Tetratop ${amount}ml`,
    ULTRAEDGE: (amount) => `Ultraedge ${amount}L`,
    HALF_GALLON: () => `Half gallon`,
  }

  return formats[container](amount)
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
