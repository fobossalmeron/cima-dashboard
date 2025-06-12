import { DataFieldSearchType } from './data-fields'

export enum CoolersQuestionsEnum {
  ENTRY_COLUMN = '¿Hay Coolers de la marca del demo en la tienda?',
  TYPE_COLUMN = 'Tamaño del Cooler',
}

export type CoolersQuestionsEntryColumn = {
  [CoolersQuestionsEnum.ENTRY_COLUMN]: {
    tags: string[]
    searchType: DataFieldSearchType
  }
  [CoolersQuestionsEnum.TYPE_COLUMN]: {
    tags: string[]
    searchType: DataFieldSearchType
  }
}

export const CoolersQuestionsValues: CoolersQuestionsEntryColumn = {
  [CoolersQuestionsEnum.ENTRY_COLUMN]: {
    tags: ['Coolers', 'tienda'],
    searchType: DataFieldSearchType.AND,
  },
  [CoolersQuestionsEnum.TYPE_COLUMN]: {
    tags: ['Tamaño', 'Cooler'],
    searchType: DataFieldSearchType.AND,
  },
}
