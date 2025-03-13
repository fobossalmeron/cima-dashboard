import { prisma } from '@/lib/prisma'
import {
  Question,
  QuestionOption,
  QuestionType,
  QuestionTrigger,
} from '@prisma/client'

interface ProductInfo {
  brand: string
  subBrand?: string
  presentation?: string
  flavor?: string
  questionGroupId?: string
}

interface QuestionWithOptions extends Question {
  options: QuestionOption[]
  triggers: QuestionTrigger[]
}

interface ProductStructure {
  brand: {
    name: string
    subBrands?: {
      name: string
      products: {
        name: string
        presentation?: string
        flavor?: string
      }[]
    }[]
  }
}

interface QuestionGroup {
  id: string
  questions: QuestionWithOptions[]
  parentTrigger?: QuestionTrigger
}

export class ProductsService {
  static async loadFromTemplate(templateId: string) {
    const template = await prisma.formTemplate.findUnique({
      where: { id: templateId },
      include: {
        questions: {
          include: {
            options: true,
            triggers: true,
            questionGroup: true,
          },
        },
      },
    })

    if (!template) {
      throw new Error('Template not found')
    }

    // Organizar preguntas por grupos
    const questionGroups = this.organizeQuestionsByGroups(
      template.questions as QuestionWithOptions[],
    )

    // Encontrar la pregunta de marca principal
    const brandQuestion = template.questions.find((q) =>
      q.name.toUpperCase().includes('MARCA ACTIVADA'),
    ) as QuestionWithOptions

    if (!brandQuestion) {
      throw new Error('No se encontró la pregunta de marca')
    }

    // Objeto para almacenar la estructura de productos
    const productsStructure: Record<string, ProductStructure> = {}

    // Procesar cada opción de marca
    for (const brandOption of brandQuestion.options) {
      // Encontrar los triggers asociados a esta marca
      const brandTriggers = brandQuestion.triggers.filter(
        (t) => t.optionId === brandOption.id,
      )

      for (const trigger of brandTriggers) {
        // Obtener el grupo de preguntas activado por este trigger
        if (!trigger.groupId) continue
        const questionGroup = questionGroups[trigger.groupId]
        if (!questionGroup) continue

        // Procesar el grupo de preguntas para esta marca
        this.processQuestionGroup(
          questionGroup,
          brandOption.value,
          questionGroups,
          productsStructure,
        )
      }
    }

    console.log('Estructura final de productos:')
    console.log(JSON.stringify(productsStructure, null, 2))

    return template
  }

  private static organizeQuestionsByGroups(
    questions: QuestionWithOptions[],
  ): Record<string, QuestionGroup> {
    const groups: Record<string, QuestionGroup> = {}

    for (const question of questions) {
      if (!question.questionGroupId) continue

      if (!groups[question.questionGroupId]) {
        groups[question.questionGroupId] = {
          id: question.questionGroupId,
          questions: [],
        }
      }

      groups[question.questionGroupId].questions.push(question)
    }

    return groups
  }

  private static processQuestionGroup(
    group: QuestionGroup,
    brandName: string,
    allGroups: Record<string, QuestionGroup>,
    productsStructure: Record<string, ProductStructure>,
  ) {
    // Normalizar el nombre de la marca
    let normalizedBrandName = brandName
    if (brandName.toUpperCase().startsWith('DEL FRUTAL')) {
      normalizedBrandName = 'Del Frutal'
    } else if (brandName.toUpperCase().includes('NATURA')) {
      normalizedBrandName = "Natura's"
    }

    // Inicializar la estructura de la marca si no existe
    if (!productsStructure[normalizedBrandName]) {
      productsStructure[normalizedBrandName] = {
        brand: {
          name: normalizedBrandName,
          subBrands: [],
        },
      }
    }

    // Procesar preguntas del grupo
    for (const question of group.questions) {
      // Si es una pregunta de precio, extraer información del producto
      if (
        question.type === QuestionType.NUMERIC &&
        question.name.toUpperCase().includes('PRECIO')
      ) {
        const productInfo = this.extractProductInfo(question.name)
        if (!productInfo) continue

        // Buscar la pregunta de ventas correspondiente en el mismo grupo
        const salesQuestion = group.questions.find(
          (q) =>
            (q.type === QuestionType.NUMERIC ||
              q.type === QuestionType.MULTISELECT) &&
            (q.name.toUpperCase().includes('UNIDADES') ||
              q.name.toUpperCase().includes('VENDIDAS')),
        )

        if (!salesQuestion) continue

        // Agregar el producto a la estructura
        this.addProductToStructure(
          productsStructure[normalizedBrandName],
          productInfo,
          salesQuestion as QuestionWithOptions,
        )
      }

      // Procesar triggers de esta pregunta para seguir la cadena
      for (const trigger of question.triggers || []) {
        if (!trigger.groupId) continue
        const nextGroup = allGroups[trigger.groupId]
        if (nextGroup) {
          this.processQuestionGroup(
            nextGroup,
            normalizedBrandName,
            allGroups,
            productsStructure,
          )
        }
      }
    }
  }

  private static extractProductInfo(questionName: string): ProductInfo | null {
    const cleanName = questionName
      .replace(/^[-\s]*PRECIO\s+/, '')
      .replace(/\s*-\s*$/, '')
      .trim()

    // Detectar marca y submarca
    let brand = ''
    let subBrand: string | undefined
    let presentation: string | undefined

    // Primero detectar la marca base
    if (cleanName.toUpperCase().includes('DEL FRUTAL')) {
      brand = 'Del Frutal'

      // Luego detectar la submarca
      if (cleanName.toUpperCase().includes('AGUAS FRESCAS')) {
        subBrand = 'Aguas Frescas'
      } else if (cleanName.toUpperCase().includes('ORANGE DRINK')) {
        subBrand = 'Orange Drink'
      } else if (
        cleanName.toUpperCase().includes('NECTAR') ||
        cleanName.toUpperCase().includes('NÉCTAR')
      ) {
        subBrand = 'Néctares'
      } else if (cleanName.toUpperCase().includes('PULPA')) {
        subBrand = 'Pulpa'
      }
    } else if (cleanName.toUpperCase().includes('RAPTOR')) {
      brand = 'Raptor'
      subBrand = 'Original'
    } else if (
      cleanName.toUpperCase().includes('TETRATOP') ||
      cleanName.toUpperCase().includes('ULTRAEDGE') ||
      cleanName.toUpperCase().includes('NATURAS') ||
      cleanName.toUpperCase().includes("NATURA'S")
    ) {
      brand = "Natura's"
      // Detectar submarca para Natura's
      if (
        cleanName.toUpperCase().includes('NECTAR') ||
        cleanName.toUpperCase().includes('NÉCTAR')
      ) {
        subBrand = 'Néctares'
      } else if (cleanName.toUpperCase().includes('PULPA')) {
        subBrand = 'Pulpa'
      }
    }

    if (!brand) return null

    // Detectar presentación
    if (cleanName.toUpperCase().includes('CAN')) {
      const canMatch = cleanName.match(/CAN\s+[\d.]+\s*(?:ml|fl\s+oz)/i)
      if (canMatch) {
        presentation = canMatch[0].trim()
      }
    } else if (cleanName.toUpperCase().includes('TETRATOP')) {
      presentation = 'Tetratop 500ml'
    } else if (cleanName.toUpperCase().includes('ULTRAEDGE')) {
      presentation = 'Ultraedge 1L'
    } else if (cleanName.toUpperCase().includes('PET')) {
      const petMatch = cleanName.match(/PET\s+[\d.]+\s*(?:ml|fl\s+oz)/i)
      if (petMatch) {
        presentation = petMatch[0].trim()
      }
    } else if (cleanName.toUpperCase().includes('TETRA')) {
      const tetraMatch = cleanName.match(/TETRA\s+[\d.]+\s*(?:ml|fl\s+oz)/i)
      if (tetraMatch) {
        presentation = tetraMatch[0].trim()
      } else if (cleanName.toUpperCase().includes('1000')) {
        presentation = 'TETRA 1000 ml'
      }
    } else if (cleanName.toUpperCase().includes('1L')) {
      presentation = '1L'
    }

    console.log('Procesando nombre:', {
      cleanName,
      brand,
      subBrand,
      presentation,
    })

    return {
      brand,
      subBrand,
      presentation,
    }
  }

  private static addProductToStructure(
    brandStructure: ProductStructure,
    productInfo: ProductInfo,
    salesQuestion: QuestionWithOptions,
  ) {
    let subBrand = brandStructure.brand.subBrands?.find(
      (sb) => sb.name === (productInfo.subBrand || 'Sin submarca'),
    )

    if (!subBrand) {
      subBrand = {
        name: productInfo.subBrand || 'Sin submarca',
        products: [],
      }
      brandStructure.brand.subBrands?.push(subBrand)
    }

    if (salesQuestion.type === QuestionType.MULTISELECT) {
      // Si es MULTISELECT, crear un producto por cada sabor
      for (const option of salesQuestion.options) {
        subBrand.products.push({
          name: this.generateProductName(productInfo, option.value),
          presentation: productInfo.presentation,
          flavor: option.value,
        })
      }
    } else {
      // Si no es MULTISELECT, crear un solo producto sin sabor
      subBrand.products.push({
        name: this.generateProductName(productInfo),
        presentation: productInfo.presentation,
      })
    }
  }

  private static generateProductName(
    productInfo: ProductInfo,
    flavor?: string,
  ): string {
    const parts = [productInfo.brand]
    if (productInfo.subBrand) parts.push(productInfo.subBrand)
    if (productInfo.presentation) parts.push(productInfo.presentation)
    if (flavor) parts.push(flavor)
    return parts.join(' - ')
  }
}
