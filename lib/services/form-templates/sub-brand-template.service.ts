import { prisma } from '@/lib/prisma'
import { FormTemplate, Prisma, SubBrand } from '@prisma/client'

export class SubBrandTemplateService {
  static async getByTemplateAndSubBrand(
    templateId: string,
    subBrandId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || prisma
    return await client.subBrandTemplate.findUnique({
      where: { subBrandId_templateId: { subBrandId, templateId } },
    })
  }

  static async create(
    data: {
      subBrand: SubBrand
      template: FormTemplate
    },
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || prisma
    return await client.subBrandTemplate.create({
      data: {
        subBrand: {
          connect: {
            id: data.subBrand.id,
          },
        },
        template: {
          connect: {
            id: data.template.id,
          },
        },
      },
    })
  }

  static async delete(
    templateId: string,
    subBrandId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || prisma
    return await client.subBrandTemplate.delete({
      where: { subBrandId_templateId: { templateId, subBrandId } },
    })
  }

  static async deleteByTemplateId(
    templateId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || prisma
    return await client.subBrandTemplate.deleteMany({ where: { templateId } })
  }
}
