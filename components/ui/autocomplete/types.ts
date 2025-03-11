/* eslint-disable @typescript-eslint/no-explicit-any */
import { Option } from '@/types'

export interface SearchConfig {
  url: string
  method?: 'GET' | 'POST'
  headers?: Record<string, string>
  transformResponse?: (data: any) => Option[]
  transformRequest?: (searchTerm: string) => any
}

export interface AutocompleteProps {
  options?: Option[]
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  emptyText?: string
  className?: string
  searchConfig?: SearchConfig
  debounceMs?: number
}
