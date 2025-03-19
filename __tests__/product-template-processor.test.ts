import { ProductTemplateProcessorService } from '@/lib/services/db'

describe('ProductTemplateProcessorService', () => {
  describe('getPresentationName', () => {
    it('debe extraer correctamente el nombre de la presentación para latas (CAN)', () => {
      const questionName = "- PRECIO Natura's NECTAR CAN 350 ml -"
      const brandName = "NATURA'S NECTAR"

      const result = ProductTemplateProcessorService.getPresentationName(
        questionName,
        brandName,
      )

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
        // Casos adicionales para probar
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
        const result = ProductTemplateProcessorService.getPresentationName(
          questionName,
          brandName,
        )
        expect(result).toBe(expected)
      })
    })

    it('debe devolver null para formatos no reconocidos', () => {
      const questionName = "- PRECIO Natura's NECTAR FORMATO INVALIDO -"
      const brandName = "NATURA'S NECTAR"

      const result = ProductTemplateProcessorService.getPresentationName(
        questionName,
        brandName,
      )

      expect(result).toBeNull()
    })
  })
})
