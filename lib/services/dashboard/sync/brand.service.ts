import { Prisma, QuestionType } from '@prisma/client'
import { BrandWithSubBrands, QuestionWithRelations } from '@/types/api'
import { SubBrandsService } from '@/lib/services'
import { slugify } from '@/lib/utils'

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
    brandValue: string | number | null,
    brandQuestion: QuestionWithRelations,
  ): Promise<BrandWithSubBrands[]> {
    const selectedBrands = this.getSelectedBrands(brandValue, brandQuestion)
    const brands: BrandWithSubBrands[] = []

    for (const brandName of selectedBrands) {
      const subBrand = await SubBrandsService.getBySlug(slugify(brandName))

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

      await tx.activatedBrand.upsert({
        where: {
          submissionId_brandId: {
            submissionId,
            brandId: subBrand.brandId,
          },
        },
        update: {},
        create: {
          submissionId,
          brandId: subBrand.brandId,
        },
      })
    }

    return brands
  }
}
