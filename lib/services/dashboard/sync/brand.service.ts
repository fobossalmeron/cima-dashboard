import { Prisma, QuestionType } from '@prisma/client'
import {
  BrandWithSubBrands,
  FormSubmissionEntryData,
  QuestionWithRelations,
} from '@/types/api'
import { slugify } from '@/lib/utils'
import {
  ActiveBrandRepository,
  BrandRepository,
  SubBrandRepository,
} from '@/lib/repositories'

export class BrandSyncService {
  static getSelectedBrands(
    brandValue: string | number | null,
    brandQuestion: QuestionWithRelations,
  ) {
    if (!brandValue || !brandQuestion.options) return []

    return brandQuestion.type === QuestionType.MULTISELECT
      ? brandValue.toString().split(' | ')
      : [brandValue.toString()]
  }

  static async processActivatedBrands(
    tx: Prisma.TransactionClient,
    submissionId: string,
    questions: QuestionWithRelations[],
    questionAnswers: FormSubmissionEntryData,
  ): Promise<BrandWithSubBrands[]> {
    const brandQuestion = questions.find((q) =>
      q.name.toUpperCase().includes('MARCA ACTIVADA'),
    )
    if (!brandQuestion) return []

    const brandValue = questionAnswers[brandQuestion.name]
    const selectedBrands = this.getSelectedBrands(brandValue, brandQuestion)
    const brands: BrandWithSubBrands[] = []

    for (const brandName of selectedBrands) {
      let subBrand = await SubBrandRepository.getBySlug(slugify(brandName))

      if (!subBrand) {
        const brandCreated = await BrandRepository.createOrUpdate(
          brandName,
          slugify(brandName),
          tx,
        )

        subBrand = await SubBrandRepository.createOrUpdate({
          name: brandName,
          slug: slugify(brandName),
          brandId: brandCreated.id,
        })
      }

      if (!subBrand) {
        throw new Error(`Marca no encontrada: ${slugify(brandName)}`)
      }

      const brandFound = brands.find((b) => b.id === subBrand.brandId)

      if (brandFound) {
        brandFound.subBrands.push(subBrand)
      } else {
        brands.push({
          ...subBrand.brand,
          subBrands: [subBrand],
        })
      }

      await ActiveBrandRepository.createOrUpdate(
        submissionId,
        subBrand.brandId,
        tx,
      )
    }

    return brands
  }
}
