import { Prisma, QuestionType } from '@prisma/client'
import { BrandWithSubBrands, QuestionWithRelations } from '@/types/api'
import { ProductTemplateProcessorService } from '@/lib/services'
import { slugify } from '@/lib/utils'

export class ProductSyncService {
  static async processProductSales(
    tx: Prisma.TransactionClient,
    submissionId: string,
    questionAnswers: Record<string, string | number | null>,
    questions: QuestionWithRelations[],
    activeQuestions: Set<string>,
    brands: BrandWithSubBrands[],
  ) {
    let totalQuantity = 0
    let totalAmount = 0
    const productSales = []

    // Encontrar todas las preguntas de precio activas
    const priceQuestions = questions.filter(
      (q) =>
        activeQuestions.has(q.id) &&
        q.type === QuestionType.NUMERIC &&
        q.name.toUpperCase().includes('PRECIO'),
    )

    for (const priceQuestion of priceQuestions) {
      const price = Number(questionAnswers[priceQuestion.name] || 0)
      if (price <= 0) continue

      // Para cada pregunta de precio, buscar en todas las marcas activas
      for (const brand of brands) {
        for (const subBrand of brand.subBrands) {
          // Extraer información del producto de la pregunta
          const presentationName =
            ProductTemplateProcessorService.getPresentationName(
              priceQuestion.name,
              brand.name,
            )

          if (!presentationName) continue

          // Buscar la pregunta MULTISELECT de unidades vendidas para esta presentación
          const salesMultiselectQuestion = questions.find(
            (q) =>
              activeQuestions.has(q.id) &&
              q.type === QuestionType.MULTISELECT &&
              q.name.toUpperCase().includes('UNIDADES VENDIDAS') &&
              q.name.toUpperCase().includes(presentationName.toUpperCase()),
          )

          if (!salesMultiselectQuestion) continue

          // Obtener los sabores seleccionados
          const selectedFlavors =
            (questionAnswers[salesMultiselectQuestion.name] as string)?.split(
              ' | ',
            ) || []

          for (const flavor of selectedFlavors) {
            // Encontrar el trigger que corresponde a este sabor
            const trigger = salesMultiselectQuestion.triggers.find(
              (t) => t.option?.value.toLowerCase() === flavor.toLowerCase(),
            )

            if (!trigger?.group) continue

            // Encontrar la pregunta de cantidad específica para este sabor en el grupo activado
            const flavorQuantityQuestion = questions.find(
              (q) =>
                activeQuestions.has(q.id) &&
                q.questionGroupId === trigger.group?.id &&
                q.name.toLowerCase().includes(flavor.toLowerCase()),
            )

            if (!flavorQuantityQuestion) continue

            const quantity = Number(
              questionAnswers[flavorQuantityQuestion.name] || 0,
            )
            if (quantity <= 0) continue

            const whereParams = {
              presentation: {
                slug: slugify(presentationName.toLowerCase()),
              },
              brand: {
                slug: brand.slug,
              },
              subBrand: {
                slug: subBrand.slug,
              },
              flavor: {
                slug: slugify(flavor.toLowerCase()),
              },
            }

            // Buscar el producto específico con este sabor
            const product = await tx.product.findFirst({
              where: whereParams,
            })

            if (!product) continue

            const total = price * quantity
            totalQuantity += quantity
            totalAmount += total

            const productSale = await tx.productSale.create({
              data: {
                submissionId,
                productId: product.id,
                quantity,
                price,
                total,
              },
            })

            productSales.push(productSale)
          }
        }
      }
    }

    return { productSales, totalQuantity, totalAmount }
  }
}
