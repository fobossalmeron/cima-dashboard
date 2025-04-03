import { DataFieldSearchType } from './data-fields'

export enum GiveawaysColumnsEnum {
  ENTRY_COLUMN = 'REGALOS PROMOCIONALES (Entregados durante la Activación)',
}

export type GiveawayEntryColumn = {
  [GiveawaysColumnsEnum.ENTRY_COLUMN]: {
    tags: string[]
    searchType: DataFieldSearchType
  }
}

export const GiveawaysColumnsValues: GiveawayEntryColumn = {
  [GiveawaysColumnsEnum.ENTRY_COLUMN]: {
    tags: ['REGALOS PROMOCIONALES'],
    searchType: DataFieldSearchType.AND,
  },
}
