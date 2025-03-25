import { FormTemplate } from '@prisma/client'

export interface FormTemplateWithDashboardsCount extends FormTemplate {
  _count: { dashboards: number }
}
