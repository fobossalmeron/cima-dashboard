import { prisma } from '@/lib/prisma'
import { FormTemplate } from '@/types/api/form-template'
import { QuestionGroupType, QuestionType } from '@prisma/client'

export class FormTemplateDbService {
  static async createFromTemplate(
    template: FormTemplate,
    clientId: string,
    dashboardName: string,
  ) {
    const { Questions, QuestionGroups, ...formTemplateData } = template
    return await prisma.$transaction(async (tx) => {
      // Crear el formulario
      const formTemplate = await tx.formTemplate.create({
        data: {
          id: formTemplateData.Id,
          name: formTemplateData.Name,
          description: formTemplateData.Description,
          active: formTemplateData.Active,
          sortOrder: formTemplateData.SortOrder,
          version: formTemplateData.Version,
          createdBy: formTemplateData.CreatedBy,
          updatedBy: formTemplateData.LastUpdatedBy,
        },
      })

      // Crear el dashboard que relaciona el template con el cliente
      await tx.dashboard.create({
        data: {
          name: dashboardName,
          clientId: clientId,
          templateId: formTemplate.id,
        },
      })

      // Crear los grupos de preguntas
      const questionGroups = await Promise.all(
        QuestionGroups.map((group) =>
          tx.questionGroup.create({
            data: {
              id: group.Id,
              formTemplateId: formTemplate.id,
              name: group.Name,
              type:
                (group.Type.toUpperCase() as QuestionGroupType) ||
                QuestionGroupType.BASIC,
            },
          }),
        ),
      )

      // Crear las preguntas y sus opciones
      const questions = await Promise.all(
        Questions.map(async (question) => {
          // Primero creamos la pregunta
          const createdQuestion = await tx.question.create({
            data: {
              id: question.Id,
              formTemplateId: formTemplate.id,
              sortOrder: question.SortOrder,
              type:
                (question.Type.toUpperCase() as QuestionType) ||
                QuestionType.TEXT,
              name: question.Name,
              isMandatory: question.IsMandatory,
              isAutoFill: question.IsAutoFill,
              questionGroupId: question.QuestionGroupId,
              forImageRecognition: question.ForImageRecognition ?? false,
            },
          })

          // Si hay opciones, las creamos
          if (question.Options && question.Options.length > 0) {
            await Promise.all(
              question.Options.map(async (option) => {
                const createdOption = await tx.questionOption.create({
                  data: {
                    id: option.Id,
                    questionId: createdQuestion.id,
                    value: option.Value,
                    sortOrder: option.SortOrder,
                  },
                })

                // Si la pregunta tiene triggers, los creamos
                if (question.Triggers) {
                  const triggers = question.Triggers.filter(
                    (trigger) => trigger.QuestionValue === option.Id,
                  )
                  if (triggers.length > 0) {
                    await Promise.all(
                      triggers.map((trigger) =>
                        tx.questionTrigger.create({
                          data: {
                            questionId: createdQuestion.id,
                            optionId: createdOption.id,
                            groupId: trigger.GroupId,
                          },
                        }),
                      ),
                    )
                  }
                }

                return createdOption
              }),
            )
          }

          // Si hay attachments, los creamos
          if (question.Attachments && question.Attachments.length > 0) {
            await tx.questionAttachment.createMany({
              data: question.Attachments.map((attachment) => ({
                id: attachment.id,
                questionId: createdQuestion.id,
                url: attachment.url,
                type: attachment.type,
                name: attachment.name,
              })),
            })
          }

          return createdQuestion
        }),
      )

      return {
        ...formTemplate,
        questions,
        questionGroups,
      }
    })
  }

  static async getById(id: string) {
    return await prisma.formTemplate.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            options: {
              include: {
                triggers: true,
              },
            },
            attachments: true,
            triggers: {
              include: {
                group: true,
                option: true,
              },
            },
          },
        },
        questionGroups: {
          include: {
            triggers: true,
          },
        },
        dashboards: {
          include: {
            client: true,
          },
        },
      },
    })
  }

  static async getAll() {
    return await prisma.formTemplate.findMany({
      include: {
        questions: {
          include: {
            options: {
              include: {
                triggers: true,
              },
            },
            attachments: true,
            triggers: {
              include: {
                group: true,
                option: true,
              },
            },
          },
        },
        questionGroups: {
          include: {
            triggers: true,
          },
        },
        dashboards: {
          include: {
            client: true,
          },
        },
      },
    })
  }
}
