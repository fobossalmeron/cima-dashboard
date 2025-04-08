import { Prisma, QuestionType } from '@prisma/client'
import { BrandWithSubBrands, QuestionWithRelations } from '@/types/api'
import { ProductTemplateProcessorService } from '@/lib/services'
import { slugify } from '@/lib/utils'
import { PresentationsEnum } from '@/enums/presentations'
import { ProductSalesRepository } from '@/lib/repositories/dashboard/product-sales.repository'

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

    // Find all active price questions
    const priceQuestions = questions.filter(
      (q) =>
        activeQuestions.has(q.id) &&
        q.type === QuestionType.NUMERIC &&
        q.name.toUpperCase().includes('PRECIO'),
    )

    for (const priceQuestion of priceQuestions) {
      const price = Number(questionAnswers[priceQuestion.name] || 0)
      if (price <= 0) continue

      // For each price question, find in all active brands
      for (const brand of brands) {
        for (const subBrand of brand.subBrands) {
          // Extract product information from the question
          const presentationName =
            ProductTemplateProcessorService.getPresentationName(
              priceQuestion.name,
              brand.name,
            )

          // Find the MULTISELECT question for units sold for this presentation
          const salesMultiselectQuestion = questions.find((q) => {
            const isActive = activeQuestions.has(q.id)
            const isValidType =
              q.type === QuestionType.MULTISELECT ||
              q.type === QuestionType.NUMERIC
            const includesUnitsSold = q.name
              .toUpperCase()
              .includes('UNIDADES VENDIDAS')
            const includesPresentation = presentationName
              ? q.name.toUpperCase().includes(presentationName.toUpperCase())
              : true
            return (
              isActive &&
              isValidType &&
              includesUnitsSold &&
              includesPresentation
            )
          })

          if (!salesMultiselectQuestion) continue

          const flavorsString = questionAnswers[salesMultiselectQuestion.name]

          if (flavorsString && typeof flavorsString === 'string') {
            const selectedFlavors = flavorsString.split(' | ') || []
            for (const flavor of selectedFlavors) {
              // Find the trigger that corresponds to this flavor
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
                  slug: presentationName
                    ? slugify(presentationName.toLowerCase())
                    : slugify(PresentationsEnum.NOT_SPECIFIED.toLowerCase()),
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

              // Search product with brand, subBrand, presentation and flavor
              let product = await tx.product.findFirst({
                where: whereParams,
              })

              // If no product is found, search without subBrand
              if (!product) {
                const {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  subBrand: subBrandRemoved,
                  ...whereParamsWithoutSubBrand
                } = whereParams
                product = await tx.product.findFirst({
                  where: whereParamsWithoutSubBrand,
                })
              }

              if (!product) continue

              await ProductSalesRepository.deleteByProductAndSubmission(
                product.id,
                submissionId,
                tx,
              )

              const total = price * quantity
              totalQuantity += quantity
              totalAmount += total

              const productSale = await ProductSalesRepository.create(
                {
                  submission: {
                    connect: {
                      id: submissionId,
                    },
                  },
                  product: {
                    connect: {
                      id: product.id,
                    },
                  },
                  quantity,
                  price,
                  total,
                },
                tx,
              )

              productSales.push(productSale)
            }
          } else {
            // If no flavors are selected, the questions contains the quantity
            const quantity = Number(
              questionAnswers[salesMultiselectQuestion.name] || 0,
            )

            if (quantity <= 0) continue

            const whereParams = {
              presentation: {
                slug: presentationName
                  ? slugify(presentationName.toLowerCase())
                  : slugify(PresentationsEnum.NOT_SPECIFIED.toLowerCase()),
              },
              brand: {
                slug: brand.slug,
              },
              subBrand: {
                slug: subBrand.slug,
              },
            }

            // Search product with brand, subBrand, presentation and flavor
            let product = await tx.product.findFirst({
              where: whereParams,
            })

            // If no product is found, search without subBrand
            if (!product) {
              const {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                subBrand: subBrandRemoved,
                ...whereParamsWithoutSubBrand
              } = whereParams
              product = await tx.product.findFirst({
                where: whereParamsWithoutSubBrand,
              })
            }

            if (!product) continue

            await ProductSalesRepository.deleteByProductAndSubmission(
              product.id,
              submissionId,
              tx,
            )

            const total = price * quantity
            totalQuantity += quantity
            totalAmount += total

            const productSale = await ProductSalesRepository.create(
              {
                submission: {
                  connect: {
                    id: submissionId,
                  },
                },
                product: {
                  connect: {
                    id: product.id,
                  },
                },
                quantity,
                price,
                total,
              },
              tx,
            )

            productSales.push(productSale)
          }
        }
      }
    }

    return { productSales, totalQuantity, totalAmount }
  }
}
