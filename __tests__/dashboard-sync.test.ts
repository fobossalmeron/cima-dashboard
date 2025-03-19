import { QuestionGroupType, QuestionType } from '@prisma/client'
import { DashboardSyncService } from '../lib/services'
import answersData from './mocks/answers.json'
import questionsData from './mocks/questions.json'
import { QuestionWithRelations } from '@/types/api'
import { slugify } from '@/lib/utils'

// Mock de datos para las pruebas
const mockQuestions: QuestionWithRelations[] = questionsData.data.map(
  (questionData) => ({
    ...questionData,
    type: questionData.type as QuestionType,
    createdAt: new Date(questionData.createdAt),
    updatedAt: new Date(questionData.updatedAt),
    options: questionData.options.map((option) => ({
      ...option,
      createdAt: new Date(option.createdAt),
      updatedAt: new Date(option.updatedAt),
    })),
    triggers:
      questionData.triggers?.map((trigger) => ({
        ...trigger,
        option: trigger.option
          ? {
              ...trigger.option,
              createdAt: new Date(trigger.option.createdAt),
              updatedAt: new Date(trigger.option.updatedAt),
            }
          : null,
        group: trigger.group
          ? {
              ...trigger.group,
              type: trigger.group.type as QuestionGroupType,
              createdAt: new Date(trigger.group.createdAt),
              updatedAt: new Date(trigger.group.updatedAt),
            }
          : null,
      })) || [],
    questionGroup: questionData.questionGroup
      ? {
          ...questionData.questionGroup,
          type: questionData.questionGroup.type as QuestionGroupType,
          createdAt: new Date(questionData.questionGroup.createdAt),
          updatedAt: new Date(questionData.questionGroup.updatedAt),
        }
      : null,
  }),
)

interface MockAnswer {
  [key: string]: string | number | null
}

// Mock de respuestas
const mockAnswers: MockAnswer = answersData.data

describe('DashboardSyncService', () => {
  describe('getActiveQuestions', () => {
    it('debe activar las preguntas del grupo cuando se selecciona la marca correspondiente', () => {
      const marcaId = mockQuestions.find((q) => q.name === 'MARCA Activada')?.id
      const precioId = mockQuestions.find(
        (q) => q.name === "- PRECIO Natura's NECTAR CAN 350 ml -",
      )?.id
      const unidadesId = mockQuestions.find(
        (q) => q.name === "- UNIDADES VENDIDAS Natura's NECTAR CAN 350 ml-",
      )?.id
      const bananaStrawberryId = mockQuestions.find(
        (q) => q.name === 'BANANA-STRAWBERRY Can 350 ml',
      )?.id
      const appleId = mockQuestions.find(
        (q) => q.name === 'APPLE Can 350 ml',
      )?.id
      const pearId = mockQuestions.find((q) => q.name === 'PEAR Can 350 ml')?.id
      const peachId = mockQuestions.find(
        (q) => q.name === 'PEACH Can 350 ml',
      )?.id
      const pineappleId = mockQuestions.find(
        (q) => q.name === 'PINEAPPLE Can 350 ml',
      )?.id
      const mangoId = mockQuestions.find(
        (q) => q.name === 'MANGO Can 350 ml',
      )?.id
      const guavaId = mockQuestions.find(
        (q) => q.name === 'GUAVA Can 350 ml',
      )?.id
      const unidadesNectarTetraId = mockQuestions.find(
        (q) => q.name === "- UNIDADES VENDIDAS Natura's NECTAR TETRA 1000 ml -",
      )?.id
      const appleTetraId = mockQuestions.find(
        (q) => q.name === 'APPLE Tetra 1 L',
      )?.id

      if (
        !marcaId ||
        !precioId ||
        !unidadesId ||
        !bananaStrawberryId ||
        !appleId ||
        !pearId ||
        !peachId ||
        !pineappleId ||
        !mangoId ||
        !guavaId ||
        !appleTetraId ||
        !unidadesNectarTetraId
      ) {
        throw new Error(
          'No se encontraron las preguntas necesarias para el test',
        )
      }

      // @ts-expect-error - Accediendo a método privado para pruebas
      const activeQuestions = DashboardSyncService.getActiveQuestions(
        mockAnswers,
        mockQuestions,
      )

      expect(activeQuestions.has(marcaId)).toBe(true)
      expect(activeQuestions.has(precioId)).toBe(true)
      expect(activeQuestions.has(unidadesId)).toBe(true)
      expect(activeQuestions.has(bananaStrawberryId)).toBe(true)
      expect(activeQuestions.has(appleId)).toBe(true)
      expect(activeQuestions.has(pearId)).toBe(true)
      expect(activeQuestions.has(peachId)).toBe(true)
      expect(activeQuestions.has(pineappleId)).toBe(true)
      expect(activeQuestions.has(mangoId)).toBe(true)
      expect(activeQuestions.has(guavaId)).toBe(true)
      expect(activeQuestions.has(unidadesNectarTetraId)).toBe(false)
      expect(activeQuestions.has(appleTetraId)).toBe(false)
    })

    it('no debe activar las preguntas del grupo cuando no se selecciona la marca correspondiente', () => {
      const marcaId = mockQuestions.find((q) => q.name === 'MARCA Activada')?.id
      const precioId = mockQuestions.find(
        (q) => q.name === "- PRECIO Natura's NECTAR CAN 350 ml -",
      )?.id
      const unidadesId = mockQuestions.find(
        (q) => q.name === "- UNIDADES VENDIDAS Natura's NECTAR CAN 350 ml-",
      )?.id

      if (!marcaId || !precioId || !unidadesId) {
        throw new Error(
          'No se encontraron las preguntas necesarias para el test',
        )
      }

      const differentAnswers = {
        'MARCA Activada': 'OTRA MARCA',
      }

      // @ts-expect-error - Accediendo a método privado para pruebas
      const activeQuestions = DashboardSyncService.getActiveQuestions(
        differentAnswers,
        mockQuestions,
      )

      // La pregunta de marca siempre debe estar activa
      expect(activeQuestions.has(marcaId)).toBe(true)
      // Las preguntas del grupo NO deben estar activas porque se seleccionó otra marca
      expect(activeQuestions.has(precioId)).toBe(false)
      expect(activeQuestions.has(unidadesId)).toBe(false)
    })
  })

  describe('processAnswers', () => {
    it('debe procesar correctamente las respuestas de diferentes tipos', () => {
      const marcaId = mockQuestions.find((q) => q.name === 'MARCA Activada')?.id
      const precioId = mockQuestions.find(
        (q) => q.name === "- PRECIO Natura's NECTAR CAN 350 ml -",
      )?.id
      const unidadesId = mockQuestions.find(
        (q) => q.name === "- UNIDADES VENDIDAS Natura's NECTAR CAN 350 ml-",
      )?.id

      if (!marcaId || !precioId || !unidadesId) {
        throw new Error(
          'No se encontraron las preguntas necesarias para el test',
        )
      }

      const questionMap = new Map(mockQuestions.map((q) => [q.name, q]))
      const activeQuestions = new Set([marcaId, precioId, unidadesId])

      // @ts-expect-error - Accediendo a método privado para pruebas
      const { answers, errors } = DashboardSyncService.processAnswers(
        mockAnswers,
        questionMap,
        activeQuestions,
        0,
      )

      // Solo deberían haber errores para las preguntas activas sin respuesta
      expect(errors.length).toBeLessThanOrEqual(4)

      // Verificar respuesta MULTISELECT (MARCA Activada)
      const marcaAnswer = answers.find((a) => a.questionId === marcaId)
      expect(marcaAnswer?.value).toBe("NATURA'S NECTAR")

      // Verificar respuesta NUMERIC (PRECIO)
      const precioAnswer = answers.find((a) => a.questionId === precioId)
      expect(precioAnswer?.value).toBe(0.99)

      // Verificar respuesta MULTISELECT (UNIDADES VENDIDAS)
      const unidadesAnswer = answers.find((a) => a.questionId === unidadesId)
      expect(unidadesAnswer?.value).toBe(
        'Banana-Strawberry | Apple | Pear | Peach | Pineapple | Mango | Guava',
      )
    })

    it('debe generar errores para valores inválidos', () => {
      const marcaId = mockQuestions.find((q) => q.name === 'MARCA Activada')?.id
      const precioId = mockQuestions.find(
        (q) => q.name === "- PRECIO Natura's NECTAR CAN 350 ml -",
      )?.id
      const unidadesId = mockQuestions.find(
        (q) => q.name === "- UNIDADES VENDIDAS Natura's NECTAR CAN 350 ml-",
      )?.id

      if (!marcaId || !precioId || !unidadesId) {
        throw new Error(
          'No se encontraron las preguntas necesarias para el test',
        )
      }

      const invalidAnswers = {
        'MARCA Activada': 'MARCA INVALIDA',
        "- PRECIO Natura's NECTAR CAN 350 ml -": 'no es un número',
        "- UNIDADES VENDIDAS Natura's NECTAR CAN 350 ml-": 'SABOR INVALIDO',
      }

      const questionMap = new Map(mockQuestions.map((q) => [q.name, q]))
      const activeQuestions = new Set([marcaId, precioId, unidadesId])

      // @ts-expect-error - Accediendo a método privado para pruebas
      const { errors } = DashboardSyncService.processAnswers(
        invalidAnswers,
        questionMap,
        activeQuestions,
        0,
      )

      expect(errors.length).toBeGreaterThan(0)
      expect(
        errors.some(
          (e) => e.column === "- PRECIO Natura's NECTAR CAN 350 ml -",
        ),
      ).toBe(true)
    })
  })

  describe('getSelectedBrands', () => {
    it('debe obtener las marcas seleccionadas', () => {
      const brandQuestion = mockQuestions.find(
        (q) => q.name === 'MARCA Activada',
      )

      if (!brandQuestion) {
        throw new Error('No se encontró la pregunta de marca')
      }

      const selectedBrands = mockAnswers[brandQuestion.name]
      const selectedBrandsArray = DashboardSyncService.getSelectedBrands(
        selectedBrands,
        brandQuestion,
      )
      expect(selectedBrandsArray).toEqual(["NATURA'S NECTAR"])
      const slugs = selectedBrandsArray.map((brand) => slugify(brand))
      expect(slugs).toEqual(['naturas-nectar'])
    })
  })
})
