import { prisma } from '@/lib/prisma'
import { Question, QuestionGroup, QuestionType } from '@prisma/client'

interface QuestionWithGroup extends Question {
  questionGroup: QuestionGroup | null
}

type TransactionClient = Omit<
  typeof prisma,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>

export class ProductMetricsService {
  static async createFromFormTemplate(formTemplateId: string) {
    const formTemplate = await prisma.formTemplate.findUnique({
      where: { id: formTemplateId },
      include: {
        questions: {
          include: {
            questionGroup: true,
          },
        },
      },
    })

    if (!formTemplate) {
      throw new Error('Form template not found')
    }

    // Obtener todas las preguntas de tipo NUMERIC que contengan "PRECIO" o "UNIDADES" en su nombre
    const priceQuestions = formTemplate.questions.filter(
      (q) =>
        q.type === QuestionType.NUMERIC &&
        q.name.toUpperCase().includes('PRECIO'),
    )

    const salesQuestions = formTemplate.questions.filter(
      (q) =>
        q.type === QuestionType.NUMERIC &&
        (q.name.toUpperCase().includes('UNIDADES') ||
          q.name.toUpperCase().includes('VENDIDAS')),
    )

    // Procesar cada pregunta de precio y sus unidades correspondientes
    for (const priceQuestion of priceQuestions) {
      try {
        // Extraer el nombre del producto del grupo de la pregunta o del nombre de la pregunta
        const productName = this.extractProductName(
          priceQuestion as QuestionWithGroup,
        )
        if (!productName) continue

        // Buscar la pregunta de unidades correspondiente
        const salesQuestion = this.findMatchingSalesQuestion(
          salesQuestions,
          productName,
        )
        if (!salesQuestion) continue

        // Buscar o crear el producto
        await prisma.$transaction(async (tx) => {
          const product = await this.findOrCreateProduct(productName, tx)

          // Crear la métrica
          await tx.productMetrics.create({
            data: {
              productId: product.id,
              formId: formTemplateId,
              price: 0, // Valor inicial
              sales: 0, // Valor inicial
            },
          })
        })
      } catch (error) {
        console.error('Error processing product metrics:', error)
        // Continuar con el siguiente producto
      }
    }
  }

  private static extractProductName(
    question: QuestionWithGroup,
  ): string | null {
    // Si la pregunta está en un grupo, usar el nombre del grupo
    if (question.questionGroup) {
      return question.questionGroup.name
    }

    // Si no, extraer del nombre de la pregunta
    const name = question.name
    if (name.includes('-')) {
      // Remover el prefijo "PRECIO" y limpiar
      return name.split('-')[1]?.trim() || null
    }

    return null
  }

  private static findMatchingSalesQuestion(
    salesQuestions: Question[],
    productName: string,
  ): Question | null {
    return (
      salesQuestions.find((q) =>
        q.name.toUpperCase().includes(productName.toUpperCase()),
      ) || null
    )
  }

  private static async findOrCreateProduct(
    productName: string,
    tx: TransactionClient,
  ) {
    // Extraer información del producto del nombre
    const { brand, subBrand, presentation, flavor } =
      this.parseProductName(productName)

    // Crear o encontrar la marca
    const brandRecord = await tx.brand.upsert({
      where: { name: brand },
      create: { name: brand },
      update: {},
    })

    // Crear o encontrar la submarca si existe
    let subBrandRecord = null
    if (subBrand) {
      subBrandRecord = await tx.subBrand.upsert({
        where: {
          name_brandId: {
            name: subBrand,
            brandId: brandRecord.id,
          },
        },
        create: {
          name: subBrand,
          brandId: brandRecord.id,
        },
        update: {},
      })
    }

    // Crear o encontrar la presentación si existe
    let presentationRecord = null
    if (presentation) {
      presentationRecord = await tx.presentation.upsert({
        where: { name: presentation },
        create: { name: presentation },
        update: {},
      })
    }

    // Crear o encontrar el sabor si existe
    let flavorRecord = null
    if (flavor) {
      flavorRecord = await tx.flavor.upsert({
        where: { name: flavor },
        create: { name: flavor },
        update: {},
      })
    }

    const productData = {
      name: productName,
      brandId: brandRecord.id,
      subBrandId: subBrandRecord?.id || null,
      presentationId: presentationRecord?.id || null,
      flavorId: flavorRecord?.id || null,
    }

    // Crear o encontrar el producto
    return await tx.product.upsert({
      where: {
        name_brandId: {
          name: productName,
          brandId: brandRecord.id,
        },
      },
      create: productData,
      update: productData,
    })
  }

  private static parseProductName(name: string) {
    // Implementar lógica para extraer marca, submarca, presentación y sabor del nombre
    // Este es un ejemplo simplificado, ajustar según el formato real de los nombres
    const parts = name.split(' - ')
    if (parts.length < 2)
      return {
        brand: 'Unknown',
        subBrand: null,
        presentation: null,
        flavor: null,
      }

    const productParts = parts[1].trim().split(' ')
    const brand = productParts[0]
    const subBrand = productParts.length > 1 ? productParts[1] : null
    const presentation = productParts.length > 2 ? productParts[2] : null
    const flavor = productParts.length > 3 ? productParts[3] : null

    return {
      brand,
      subBrand,
      presentation,
      flavor,
    }
  }
}
