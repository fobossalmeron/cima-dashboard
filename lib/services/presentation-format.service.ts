import {
  PRESENTATION_PATTERNS,
  formatPresentation,
} from '@/lib/constants/regex'

export class PresentationFormatService {
  /**
   * Extrae y formatea el nombre de la presentación de una pregunta de precio
   * @param questionName - Nombre de la pregunta (ej: "- PRECIO Natura's NECTAR CAN 350 ml -")
   * @param brandName - Nombre de la marca a remover del texto
   * @returns Nombre formateado de la presentación o null si no se reconoce el formato
   */
  public static getPresentationName(
    questionName: string,
    brandName: string,
  ): string | null {
    const cleanName = questionName
      .replace(/^[-\s]*PRECIO\s+/, '')
      .replace(/\s*-\s*$/, '')
      .replace(brandName, '')
      .trim()

    for (const [container, pattern] of Object.entries(PRESENTATION_PATTERNS)) {
      const match = cleanName.match(pattern)
      if (match) {
        if (container === 'PACK') {
          // Para PACK, el primer grupo es la cantidad de packs y el segundo es la cantidad en ml
          const packAmount = match[1]
          const size = match[2]
          const unit = match[3] || 'ml'
          return formatPresentation(
            container as keyof typeof PRESENTATION_PATTERNS,
            packAmount,
            `${size} ${unit}`,
          )
        }

        const amount = match[1]
        const unit = match[2] || 'ml'
        return formatPresentation(
          container as keyof typeof PRESENTATION_PATTERNS,
          amount,
          unit,
        )
      }
    }
    return null
  }
}
