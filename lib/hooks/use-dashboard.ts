import { DashboardFilters } from '@/types/services/dashboard.types'
import { useQuery } from '@tanstack/react-query'
import { useState, useCallback } from 'react'

interface UseDashboardOptions {
  id?: string
  filters?: DashboardFilters
  initialEnabled?: boolean
}

export function useDashboard({
  id,
  filters,
  initialEnabled = false,
}: UseDashboardOptions) {
  const [enabled, setEnabled] = useState(initialEnabled)

  const query = useQuery({
    queryKey: ['dashboard', id, filters],
    queryFn: async () => {
      const searchParams = new URLSearchParams()

      if (filters?.dateRange) {
        searchParams.set('dateRange', JSON.stringify(filters.dateRange))
      }
      if (filters?.brandIds?.length) {
        searchParams.set('brandIds', filters.brandIds.join(','))
      }
      if (filters?.city) {
        searchParams.set('city', filters.city)
      }
      if (filters?.locationId) {
        searchParams.set('locationId', filters.locationId)
      }

      const queryString = searchParams.toString()
      const url = `/api/dashboard/${id}${queryString ? `?${queryString}` : ''}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Error al cargar el dashboard')
      }

      return response.json()
    },
    enabled: enabled && !!id,
  })

  const fetchDashboard = useCallback(() => {
    setEnabled(true)
  }, [])

  return {
    ...query,
    fetchDashboard,
  }
}
