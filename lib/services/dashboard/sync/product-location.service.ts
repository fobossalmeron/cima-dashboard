import { Prisma } from '@prisma/client'
import { ProductLocationRepository } from '@/lib/repositories'
import { slugify } from '@/lib/utils'
import { FormSubmissionEntryData, QuestionWithRelations } from '@/types/api'

export class ProductLocationService {
  static async processRow(
    row: FormSubmissionEntryData,
    questions: QuestionWithRelations[],
    tx?: Prisma.TransactionClient,
  ) {
    const productLocationQuestion = questions.find((q) =>
      q.name.toUpperCase().includes('UBICACIÓN DEL PRODUCTO'),
    )
    if (!productLocationQuestion) return null

    const productLocation = row[productLocationQuestion.name]
    if (!productLocation) return null

    const productLocationName = productLocation.toString()

    return await ProductLocationRepository.createOrUpdate(
      { name: productLocationName, slug: slugify(productLocationName) },
      tx,
    )
  }
}
