export interface FormTemplateSearchResponse {
  id: string
  name: string
  description: string | null
  active: boolean
  sortOrder: number
  version: number
  createdAt: Date
  updatedAt: Date
  createdBy: string
  updatedBy: string
}
