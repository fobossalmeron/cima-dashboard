import { capitalizeWords, groupBy, slugify } from '@/lib/utils'
import {
  ProductsStructure,
  QuestionGroup,
  QuestionWithOptions,
} from '@/types/api'
import {
  Brand,
  Flavor,
  Presentation,
  QuestionType,
  SubBrand,
  Prisma,
} from '@prisma/client'
import {
  PRESENTATION_PATTERNS,
  formatPresentation,
} from '@/lib/constants/regex'
import { TextClusteringService } from '../text-clustering.service'
import { FormTemplateService } from './form-template.service'
import { prisma } from '@/lib/prisma'
import { BrandsService } from './brands.service'
import { SubBrandService } from './sub-brand.service'
import { PresentationService } from './presentation.service'
import { FlavorService } from './flavor.service'
import { ProductsService } from './products.service'
import { PresentationsEnum } from '@/enums/presentations'
import { SubBrandsEnum } from '@/enums/sub-brands'

type TransactionClient = Prisma.TransactionClient

export class ProductTemplateProcessor {
  static async processTemplate(templateId: string) {
    return await prisma.$transaction(async (tx) => {
      const template = await FormTemplateService.getById(templateId)

      if (!template) {
        throw new Error('Template not found')
      }

      const groups = groupBy<QuestionWithOptions, QuestionGroup>(
        template.questions as QuestionWithOptions[],
        'questionGroupId',
      )

      const brandQuestion = template.questions.find((q) =>
        q.name.toUpperCase().includes('MARCA ACTIVADA'),
      ) as QuestionWithOptions

      if (!brandQuestion) {
        throw new Error('No se encontró la pregunta de marca')
      }

      const productsStructure: ProductsStructure = {}

      // Use the text clustering service to group similar brands
      const items = await TextClusteringService.groupSimilarTexts(
        brandQuestion.options.map((opt) => opt.value),
        0.7, // Similarity threshold
      )

      // Process each brand group
      for (const item of items) {
        if (!item.group || item.group === null) continue
        // Create or update the base brand
        const brand = await BrandsService.createOrUpdate(
          {
            name: capitalizeWords(item.group.baseName),
            slug: slugify(item.group.baseName),
          },
          tx,
        )

        // Initialize the structure for this brand
        if (!productsStructure[brand.slug]) {
          productsStructure[brand.slug] = {
            info: brand,
            subBrands: {},
          }
        }

        const subBrandName = capitalizeWords(item.item)
          .replace(capitalizeWords(brand.name), '')
          .trim()
        // Check if a new sub brand should be created
        const shouldCreateSubBrand = item.item !== item.group?.baseName

        const subBrand = await SubBrandService.createOrUpdate(
          {
            name: shouldCreateSubBrand
              ? subBrandName
              : SubBrandsEnum.NOT_SPECIFIED,
            slug: slugify(
              `${brand.slug}-${
                shouldCreateSubBrand
                  ? subBrandName
                  : SubBrandsEnum.NOT_SPECIFIED
              }`,
            ),
            brandId: brand.id,
          },
          tx,
        )

        const brandOption = brandQuestion.options.find(
          (opt) => opt.value === item.item,
        )
        if (!brandOption) continue

        const brandTriggers = brandQuestion.triggers.filter(
          (t) => t.optionId === brandOption?.id,
        )

        for (const trigger of brandTriggers) {
          if (!trigger.groupId) continue
          const questionGroup = groups[trigger.groupId ?? 0]
          if (!questionGroup) continue

          await this.processQuestionGroup(
            tx,
            questionGroup,
            brand,
            productsStructure,
            subBrand,
            groups,
          )
        }
      }

      return productsStructure
    })
  }

  private static async processQuestionGroup(
    tx: TransactionClient,
    group: QuestionGroup,
    brand: Brand,
    productsStructure: ProductsStructure,
    subBrand: SubBrand,
    groups: Record<string, QuestionGroup>,
  ) {
    // Initialize the brand structure if it doesn't exist
    if (!productsStructure[brand.slug]) {
      productsStructure[brand.slug] = {
        info: brand,
        subBrands: {},
      }
    }

    // Process questions of the group
    for (const question of group.items) {
      // If it's a price question, extract product information
      if (
        question.type === QuestionType.NUMERIC &&
        question.name.toUpperCase().includes('PRECIO')
      ) {
        const presentation = await this.createPresentation(
          tx,
          brand,
          question.name,
        )

        if (!presentation) {
          throw new Error(`Presentation not found for ${question.name}`)
        }

        const subBrandKey = subBrand.slug
        if (!productsStructure[brand.slug].subBrands) {
          productsStructure[brand.slug].subBrands = {}
        }
        productsStructure[brand.slug].subBrands[subBrandKey] = {
          name: subBrand.name,
          info: subBrand,
          presentation: presentation,
          products: [],
        }

        // Find the corresponding sales question in the same group
        const salesQuestion = group.items.find(
          (q) =>
            (q.type === QuestionType.NUMERIC ||
              q.type === QuestionType.MULTISELECT) &&
            (q.name.toUpperCase().includes('UNIDADES') ||
              q.name.toUpperCase().includes('VENDIDAS')),
        )

        // If there is no sales question skip the product
        if (!salesQuestion) continue

        const flavors = await this.createFlavors(tx, salesQuestion)

        for (const flavor of flavors) {
          const product = await ProductsService.create(
            {
              name: ProductsService.generateProductName(
                brand.name,
                subBrand?.name || null,
                presentation.name,
                flavor.name,
              ),
              brandId: brand.id,
              subBrandId: subBrand?.id ?? null,
              presentationId: presentation.id,
              flavorId: flavor.id,
              imageUrl: null,
            },
            tx,
          )

          productsStructure[brand.slug].subBrands[subBrandKey].products.push(
            product,
          )
        }
      }
      // Process triggers of this question to follow the chain
      for (const trigger of question.triggers || []) {
        if (!trigger.groupId) continue
        const nextGroup = groups[trigger.groupId]
        if (nextGroup) {
          await this.processQuestionGroup(
            tx,
            nextGroup,
            brand,
            productsStructure,
            subBrand,
            groups,
          )
        }
      }
    }
  }

  private static async createPresentation(
    tx: TransactionClient,
    brand: Brand,
    questionName: string,
  ): Promise<Presentation> {
    const cleanName = questionName
      .replace(/^[-\s]*PRECIO\s+/, '')
      .replace(/\s*-\s*$/, '')
      .replace(brand.name, '')
      .trim()

    // Detect presentation using regular expressions
    for (const [container, pattern] of Object.entries(PRESENTATION_PATTERNS)) {
      const match = cleanName.match(pattern)
      if (match) {
        const amount = match.length > 2 ? `${match[1]},${match[2]}` : match[1]
        const presentationName = formatPresentation(
          container as keyof typeof PRESENTATION_PATTERNS,
          amount,
        )
        return await PresentationService.createOrUpdate(
          {
            name: presentationName,
          },
          tx,
        )
      }
    }
    throw new Error(`Presentation not found for ${questionName}`)
  }

  private static async createFlavors(
    tx: TransactionClient,
    salesQuestion: QuestionWithOptions,
  ): Promise<Flavor[]> {
    const flavors: Flavor[] = []

    if (salesQuestion.type === QuestionType.MULTISELECT) {
      // If it's MULTISELECT, create a product for each flavor
      for (const option of salesQuestion.options) {
        const flavor = await FlavorService.createOrUpdate(
          {
            name: option.value,
            slug: slugify(option.value.toLowerCase()),
          },
          tx,
        )
        flavors.push(flavor)
      }
    } else {
      const notSpecifiedFlavor = PresentationsEnum.NOT_SPECIFIED
      // If it's not MULTISELECT, create a single product without flavor
      const flavor = await FlavorService.createOrUpdate(
        {
          name: notSpecifiedFlavor,
          slug: slugify(notSpecifiedFlavor.toLowerCase()),
        },
        tx,
      )
      flavors.push(flavor)
    }

    return flavors
  }
}
