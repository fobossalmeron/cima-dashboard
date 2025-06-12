import { Prisma } from '@prisma/client'

// Tipo principal exportado con todas las relaciones
export type QuestionWithRelations = Prisma.QuestionGetPayload<{
  include: {
    options: {
      include: {
        triggers: true
      }
    }
    triggers: {
      include: {
        option: true
        group: {
          include: {
            questions: true
          }
        }
      }
    }
    attachments: true
    questionGroup: {
      include: {
        questions: true
      }
    }
  }
}>

// Tipo para el Map
export type QuestionMap = Map<string, QuestionWithRelations>
