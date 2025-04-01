import { Prisma, ProductLocationSubmission } from '@prisma/client'
import { ProductLocationRepository } from '@/lib/repositories'
import { slugify } from '@/lib/utils'
import { FormSubmissionEntryData, QuestionWithRelations } from '@/types/api'
import { ProductLocationSubmissionRepository } from '@/lib/repositories/dashboard/product-location-submission.repository'

export class ProductLocationService {
  static async processRow(
    submissionId: string,
    row: FormSubmissionEntryData,
    questions: QuestionWithRelations[],
    tx?: Prisma.TransactionClient,
  ): Promise<ProductLocationSubmission[]> {
    const productLocationQuestion = questions.find((q) =>
      q.name.toUpperCase().includes('UBICACIÓN DEL PRODUCTO'),
    )
    if (!productLocationQuestion) return []

    const productLocation = row[productLocationQuestion.name]
    if (!productLocation) return []

    const productLocationOptions = productLocation.toString().split(' | ')

    const productLocationSubmissions = []

    for (const location of productLocationOptions) {
      const locationName = location.trim()
      const locationSlug = slugify(locationName)
      const dbLocation = await ProductLocationRepository.createOrUpdate(
        { name: locationName, slug: locationSlug },
        tx,
      )
      const productLocationSubmissionExists =
        await ProductLocationSubmissionRepository.findByProductLocationId(
          dbLocation.id,
          submissionId,
        )
      if (productLocationSubmissionExists) {
        productLocationSubmissions.push(productLocationSubmissionExists)
      } else {
        const productLocationSubmission =
          await ProductLocationSubmissionRepository.create(
            {
              productLocation: {
                connect: {
                  id: dbLocation.id,
                },
              },
              submission: {
                connect: {
                  id: submissionId,
                },
              },
            },
            tx,
          )
        productLocationSubmissions.push(productLocationSubmission)
      }
    }

    return productLocationSubmissions
  }
}
