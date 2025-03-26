import { prisma } from '@/lib/prisma'
import {
  CreateOrUpdateConsumptionMomentSamplingData,
  SamplingConsumptionMomentWithRelations,
} from '@/types/services'
import { Prisma } from '@prisma/client'
import { ConsumptionMomentRepository } from '../../catalogs'

export class SamplingConsumptionMomentRepository {
  static async getFirst(data: CreateOrUpdateConsumptionMomentSamplingData) {
    return await prisma.consumptionMomentSampling.findFirst({
      where: data,
    })
  }

  static async createOrUpdate(
    data: CreateOrUpdateConsumptionMomentSamplingData,
    tx?: Prisma.TransactionClient,
  ): Promise<SamplingConsumptionMomentWithRelations> {
    const client = tx ?? prisma
    const consumptionMoment = await ConsumptionMomentRepository.getById(
      data.consumptionMomentId,
    )
    if (!consumptionMoment) {
      throw new Error(
        `Consumption moment not found for value: ${data.consumptionMomentId}`,
      )
    }
    const consumptionMomentSamplingExists = await this.getFirst(data)
    if (consumptionMomentSamplingExists) {
      // Delete the existing consumption moment sampling
      await client.consumptionMomentSampling.delete({
        where: {
          consumptionMomentId_samplingId: {
            consumptionMomentId:
              consumptionMomentSamplingExists.consumptionMomentId,
            samplingId: consumptionMomentSamplingExists.samplingId,
          },
        },
      })
      // Create the new consumption moment sampling
      const consumptionMomentSampling =
        await client.consumptionMomentSampling.create({
          data: {
            consumptionMomentId: consumptionMoment.id,
            samplingId: data.samplingId,
          },
        })
      return {
        ...consumptionMomentSampling,
        consumptionMoment,
      }
    }
    // Create a new consumption moment sampling
    const consumptionMomentSampling =
      await client.consumptionMomentSampling.create({
        data: {
          consumptionMomentId: consumptionMoment.id,
          samplingId: data.samplingId,
        },
      })
    return {
      ...consumptionMomentSampling,
      consumptionMoment,
    }
  }
}
