import { prisma } from '@/lib/prisma'
import { QuestionWithRelations } from '@/types/api'

export class QuestionRepository {
  /**
   * Get all questions from a template
   * @param {string} templateId - The ID of the template
   * @returns {Promise<QuestionWithRelations[]>} An array of questions with their relations
   */
  static async getTemplateQuestions(
    templateId: string,
  ): Promise<QuestionWithRelations[]> {
    return await prisma.question.findMany({
      where: {
        formTemplateId: templateId,
      },
      include: {
        options: true,
        questionGroup: true,
        triggers: {
          include: {
            option: true,
            group: {
              include: {
                questions: true,
              },
            },
          },
        },
      },
    })
  }
}
