import { prisma } from '@/lib/prisma'
import {
  FormTemplate,
  Question,
  QuestionOption,
  QuestionTrigger,
  QuestionType,
  QuestionGroupType,
} from '@prisma/client'
import { FormTemplate as RepslyFormTemplate } from '@/types/api/form-template'

export type FormTemplateWithQuestionsAndOptions = FormTemplate & {
  questions: (Question & {
    options: QuestionOption[]
    triggers: QuestionTrigger[]
  })[]
}

export class FormTemplateService {
  static async getAll(): Promise<FormTemplate[]> {
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

  static async getById(
    id: string,
  ): Promise<FormTemplateWithQuestionsAndOptions | null> {
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
            questionGroup: true,
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

  static async create(data: {
    name: string
    description?: string | null
    sortOrder: number
    createdBy: string
    updatedBy: string
    questions: {
      name: string
      type: QuestionType
      sortOrder: number
      isMandatory?: boolean
      isAutoFill?: boolean
      forImageRecognition?: boolean
      questionGroupId?: string | null
      options?: {
        value: string
        sortOrder: number
      }[]
      triggers?: {
        optionId: string
        groupId: string
      }[]
    }[]
  }): Promise<FormTemplateWithQuestionsAndOptions> {
    return await prisma.formTemplate.create({
      data: {
        name: data.name,
        description: data.description,
        sortOrder: data.sortOrder,
        createdBy: data.createdBy,
        updatedBy: data.updatedBy,
        active: true,
        version: 1,
        questions: {
          create: data.questions.map((question) => ({
            name: question.name,
            type: question.type,
            sortOrder: question.sortOrder,
            isMandatory: question.isMandatory ?? false,
            isAutoFill: question.isAutoFill ?? false,
            forImageRecognition: question.forImageRecognition ?? false,
            questionGroupId: question.questionGroupId,
            options: question.options
              ? {
                  create: question.options.map((opt) => ({
                    ...opt,
                    sortOrder: opt.sortOrder,
                  })),
                }
              : undefined,
            triggers: question.triggers
              ? {
                  create: question.triggers,
                }
              : undefined,
          })),
        },
      },
      include: {
        questions: {
          include: {
            options: true,
            triggers: true,
          },
        },
      },
    })
  }

  static async update(
    id: string,
    data: Partial<FormTemplate>,
  ): Promise<FormTemplateWithQuestionsAndOptions> {
    return await prisma.formTemplate.update({
      where: { id },
      data,
      include: {
        questions: {
          include: {
            options: true,
            triggers: true,
          },
        },
      },
    })
  }

  static async remove(id: string): Promise<FormTemplate> {
    return await prisma.formTemplate.delete({
      where: { id },
    })
  }

  static async addQuestion(
    templateId: string,
    data: {
      name: string
      type: QuestionType
      sortOrder: number
      isMandatory?: boolean
      isAutoFill?: boolean
      forImageRecognition?: boolean
      questionGroupId?: string | null
      options?: {
        value: string
        sortOrder: number
      }[]
      triggers?: {
        optionId: string
        groupId: string
      }[]
    },
  ): Promise<Question> {
    return await prisma.question.create({
      data: {
        name: data.name,
        type: data.type,
        sortOrder: data.sortOrder,
        isMandatory: data.isMandatory ?? false,
        isAutoFill: data.isAutoFill ?? false,
        forImageRecognition: data.forImageRecognition ?? false,
        questionGroupId: data.questionGroupId,
        formTemplateId: templateId,
        options: data.options
          ? {
              create: data.options.map((opt) => ({
                ...opt,
                sortOrder: opt.sortOrder,
              })),
            }
          : undefined,
        triggers: data.triggers
          ? {
              create: data.triggers,
            }
          : undefined,
      },
      include: {
        options: true,
        triggers: true,
      },
    })
  }

  static async removeQuestion(id: string): Promise<Question> {
    return await prisma.question.delete({
      where: { id },
    })
  }

  static async addOptionToQuestion(
    questionId: string,
    data: {
      value: string
      sortOrder: number
    },
  ): Promise<QuestionOption> {
    return await prisma.questionOption.create({
      data: {
        ...data,
        questionId,
      },
    })
  }

  static async removeOption(id: string): Promise<QuestionOption> {
    return await prisma.questionOption.delete({
      where: { id },
    })
  }

  static async addTriggerToQuestion(
    questionId: string,
    data: {
      optionId: string
      groupId: string
    },
  ): Promise<QuestionTrigger> {
    return await prisma.questionTrigger.create({
      data: {
        ...data,
        questionId,
      },
    })
  }

  static async removeTrigger(id: string): Promise<QuestionTrigger> {
    return await prisma.questionTrigger.delete({
      where: { id },
    })
  }

  static async createFromTemplate(
    template: RepslyFormTemplate,
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
}
