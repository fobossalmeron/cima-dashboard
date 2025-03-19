import {
  PRESENTATION_PATTERNS,
  formatPresentation,
} from '@/lib/constants/regex'

function getPresentationName(
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

describe('getPresentationName', () => {
  it('debe extraer correctamente el nombre de la presentación para latas (CAN)', () => {
    const questionName = "- PRECIO Natura's NECTAR CAN 350 ml -"
    const brandName = "NATURA'S NECTAR"

    const result = getPresentationName(questionName, brandName)

    expect(result).toBe('CAN 350 ml')
  })

  it('debe manejar diferentes formatos de preguntas de precio', () => {
    const testCases = [
      {
        questionName: "- PRECIO Natura's NECTAR CAN 350 ml -",
        brandName: "NATURA'S NECTAR",
        expected: 'CAN 350 ml',
      },
      {
        questionName: "- PRECIO Natura's NECTAR TETRA 1000 ml -",
        brandName: "NATURA'S NECTAR",
        expected: 'TETRA 1000 ml',
      },
      {
        questionName: "- PRECIO Natura's NECTAR PET 500 ml -",
        brandName: "NATURA'S NECTAR",
        expected: 'PET 500 ml',
      },
      {
        questionName: "- PRECIO Natura's NECTAR 6 PACK TETRA 200 ml -",
        brandName: "NATURA'S NECTAR",
        expected: '6Pack TETRA 200 ml',
      },
      {
        questionName: "- PRECIO Natura's NECTAR 1L -",
        brandName: "NATURA'S NECTAR",
        expected: 'L',
      },
    ]

    testCases.forEach(({ questionName, brandName, expected }) => {
      const result = getPresentationName(questionName, brandName)
      expect(result).toBe(expected)
    })
  })

  it('debe devolver null para formatos no reconocidos', () => {
    const questionName = "- PRECIO Natura's NECTAR FORMATO INVALIDO -"
    const brandName = "NATURA'S NECTAR"

    const result = getPresentationName(questionName, brandName)

    expect(result).toBeNull()
  })
})
