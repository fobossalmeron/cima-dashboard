import { DataFieldSearchType } from './data-fields'

export enum PopQuestionsEnum {
  ENTRY_COLUMN = '¿Hay material POP de la marca del demo en la tienda?',
  TYPE_COLUMN = 'Tipo de Material POP',
}

export type PopQuestionsEntryColumn = {
  [PopQuestionsEnum.ENTRY_COLUMN]: {
    tags: string[]
    searchType: DataFieldSearchType
  }
  [PopQuestionsEnum.TYPE_COLUMN]: {
    tags: string[]
    searchType: DataFieldSearchType
  }
}

export const PopQuestionsValues: PopQuestionsEntryColumn = {
  [PopQuestionsEnum.ENTRY_COLUMN]: {
    tags: ['POP', 'tienda'],
    searchType: DataFieldSearchType.AND,
  },
  [PopQuestionsEnum.TYPE_COLUMN]: {
    tags: ['Tipo', 'POP'],
    searchType: DataFieldSearchType.AND,
  },
}
