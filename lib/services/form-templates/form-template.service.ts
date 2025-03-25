import { prisma } from '@/lib/prisma'
import {
  FormTemplate,
  Question,
  QuestionOption,
  QuestionTrigger,
  QuestionType,
  QuestionGroupType,
  Prisma,
  QuestionGroup,
  Dashboard,
  QuestionAttachment,
} from '@prisma/client'
import {
  DashboardCreateParams,
  FormTemplateCreateParams,
  FormTemplateCreateResponse,
  FormTemplateQuestion,
  FormTemplateQuestionGroup,
  FormTemplateServiceParams,
} from '@/types/api/form-template'
import { QuestionWithRelations } from '@/types/api/clients'
import { QuestionOptionWithRelations } from '@/types/api'
import { withTransaction } from '@/prisma/prisma'
import { FormTemplateWithDashboardsCount } from '@/types/services/form-template.types'

export type FormTemplateWithQuestionsAndOptions = FormTemplate & {
  questions: (Question & {
    options: QuestionOptionWithRelations[]
    triggers: QuestionTrigger[]
  })[]
  questionGroups: QuestionGroup[]
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

  static async getByIdWithDashboardsCount(
    id: string,
  ): Promise<FormTemplateWithDashboardsCount | null> {
    return await prisma.formTemplate.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        sortOrder: true,
        active: true,
        version: true,
        createdBy: true,
        updatedBy: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            dashboards: true,
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
            options: {
              include: {
                triggers: true,
              },
            },
            attachments: true,
            triggers: true,
          },
        },
        questionGroups: true,
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
            options: {
              include: {
                triggers: true,
              },
            },
            attachments: true,
            triggers: true,
          },
        },
        questionGroups: true,
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

  private static async createTemplate(
    data: FormTemplateCreateParams,
    tx: Prisma.TransactionClient,
  ): Promise<FormTemplate> {
    return await tx.formTemplate.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    })
  }

  private static async createDashboard(
    data: DashboardCreateParams,
    tx: Prisma.TransactionClient,
  ): Promise<Dashboard> {
    return await tx.dashboard.create({
      data,
    })
  }

  private static async createQuestionGroups(
    questionGroups: FormTemplateQuestionGroup[],
    formTemplateId: string,
    tx: Prisma.TransactionClient,
  ): Promise<QuestionGroup[]> {
    return await Promise.all(
      questionGroups.map((group) =>
        tx.questionGroup.upsert({
          where: { id: group.Id },
          update: {
            name: group.Name,
            type:
              (group.Type.toUpperCase() as QuestionGroupType) ||
              QuestionGroupType.BASIC,
          },
          create: {
            id: group.Id,
            name: group.Name,
            type:
              (group.Type.toUpperCase() as QuestionGroupType) ||
              QuestionGroupType.BASIC,
            formTemplateId,
          },
        }),
      ),
    )
  }

  private static getQuestionType(type: string): QuestionType {
    switch (type.toUpperCase()) {
      case 'CHECKBOX':
        return QuestionType.CHECKBOX
      case 'SELECT':
        return QuestionType.SELECT
      case 'MULTISELECT':
        return QuestionType.MULTISELECT
      case 'DATE':
        return QuestionType.DATE
      case 'NUMERIC':
        return QuestionType.NUMERIC
      case 'TEXT':
        return QuestionType.TEXT
      case 'PHOTO':
        return QuestionType.PHOTO
      default:
        return QuestionType.TEXT
    }
  }

  private static async createQuestions(
    questions: FormTemplateQuestion[],
    formTemplateId: string,
    tx: Prisma.TransactionClient,
  ): Promise<QuestionWithRelations[]> {
    return await Promise.all(
      questions.map(async (question) => {
        // Primero creamos la pregunta
        const questionData = {
          id: question.Id,
          sortOrder: question.SortOrder,
          type: FormTemplateService.getQuestionType(question.Type),
          name: question.Name,
          isMandatory: question.IsMandatory,
          isAutoFill: question.IsAutoFill,
          questionGroupId: question.QuestionGroupId,
          forImageRecognition: question.ForImageRecognition ?? false,
          formTemplateId,
        }
        const { id, ...rest } = questionData

        const createdQuestion = await tx.question.upsert({
          where: { id: question.Id },
          update: rest,
          create: questionData,
        })

        let options: QuestionOptionWithRelations[] = []
        let triggers: QuestionTrigger[] = []
        let attachments: QuestionAttachment[] = []
        // Si hay opciones, las creamos
        if (question.Options && question.Options.length > 0) {
          options = await Promise.all(
            question.Options.map(async (option) => {
              const optionData = {
                id: option.Id,
                questionId: createdQuestion.id,
                value: option.Value,
                sortOrder: option.SortOrder,
              }
              const { id, ...rest } = optionData
              const createdOption = await tx.questionOption.upsert({
                where: { id: option.Id },
                update: rest,
                create: optionData,
              })

              let localTriggers: QuestionTrigger[] = []

              // Si la pregunta tiene triggers, los creamos
              if (question.Triggers) {
                const questionTriggers = question.Triggers.filter(
                  (trigger) => trigger.QuestionValue === option.Id,
                )
                if (questionTriggers.length > 0) {
                  localTriggers = await Promise.all(
                    questionTriggers.map(async (trigger) => {
                      const triggerData = {
                        questionId: createdQuestion.id,
                        optionId: createdOption.id,
                        groupId: trigger.GroupId,
                      }
                      const { groupId, optionId, questionId } = triggerData
                      const triggerExists = await tx.questionTrigger.findFirst({
                        where: { groupId, optionId, questionId },
                      })
                      if (triggerExists) {
                        return triggerExists
                      }
                      return tx.questionTrigger.create({
                        data: triggerData,
                      })
                    }),
                  )
                }
                triggers = [...triggers, ...localTriggers]
              }

              return {
                ...createdOption,
                triggers: localTriggers,
              }
            }),
          )
        }

        // Si hay attachments, los creamos
        if (question.Attachments && question.Attachments.length > 0) {
          attachments = await Promise.all(
            question.Attachments.map(async (attachment) => {
              const attachmentData = {
                id: attachment.id,
                questionId: createdQuestion.id,
                url: attachment.url,
                type: attachment.type,
                name: attachment.name,
              }
              const { id, ...rest } = attachmentData
              return await tx.questionAttachment.upsert({
                where: { id: attachment.id },
                update: rest,
                create: attachmentData,
              })
            }),
          )
        }

        return {
          ...createdQuestion,
          options,
          triggers,
          attachments,
        }
      }),
    )
  }

  static async createFromTemplate(
    data: FormTemplateServiceParams,
    tx?: Prisma.TransactionClient,
  ): Promise<FormTemplateCreateResponse> {
    const { Questions, QuestionGroups, ...formTemplateData } = data.template
    const formTemplateObject = {
      id: formTemplateData.Id,
      name: formTemplateData.Name,
      description: formTemplateData.Description,
      active: formTemplateData.Active,
      sortOrder: formTemplateData.SortOrder,
      version: formTemplateData.Version,
      createdBy: formTemplateData.CreatedBy,
      updatedBy: formTemplateData.LastUpdatedBy,
    }
    const dashboardData = {
      clientId: data.clientId,
      name: formTemplateData.Name,
      templateId: formTemplateData.Id,
    }

    if (tx) {
      const formTemplate = await this.createTemplate(formTemplateObject, tx)
      const dashboard = await this.createDashboard(dashboardData, tx)
      const questionGroups = await this.createQuestionGroups(
        QuestionGroups,
        formTemplate.id,
        tx,
      )
      const questions = await this.createQuestions(
        Questions,
        formTemplate.id,
        tx,
      )

      return {
        dashboard,
        template: {
          ...formTemplate,
          questions: questions.map((question) => ({
            ...question,
            options: question.options.map((option) => ({
              ...option,
              triggers: option.triggers,
            })),
          })),
          questionGroups,
        },
      }
    } else {
      return await withTransaction(async (tx) => {
        // Crear el formulario
        const formTemplate = await this.createTemplate(formTemplateObject, tx)

        // Crear el dashboard que relaciona el template con el cliente
        const dashboard = await this.createDashboard(dashboardData, tx)

        // Crear los grupos de preguntas
        const questionGroups = await this.createQuestionGroups(
          QuestionGroups,
          formTemplate.id,
          tx,
        )

        // Crear las preguntas y sus opciones
        const questions = await this.createQuestions(
          Questions,
          formTemplate.id,
          tx,
        )

        return {
          dashboard,
          template: {
            ...formTemplate,
            questions,
            questionGroups,
          },
        }
      })
    }
  }
}
