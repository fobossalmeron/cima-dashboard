export interface DateRange {
  startDate: Date
  endDate: Date
}

export interface DashboardFilters {
  dateRange?: DateRange
  brandIds: string[]
  city?: string
  locationId?: string
}
