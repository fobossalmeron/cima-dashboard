import { MapsData } from '@/components/general/general.types'
import { DashboardWithRelations } from '@/types/api/clients'

export function getMapsData(dashboard?: DashboardWithRelations): MapsData {
  if (!dashboard?.submissions) {
    return {
      citiesData: [],
      storesData: [],
    }
  }

  // Agrupar submissions por ubicación
  const locationMap = dashboard.submissions.reduce(
    (acc, submission) => {
      if (!submission.location) return acc

      const location = submission.location

      // Procesar datos de la ciudad
      const cityKey = `${location.city}-${location.state}`
      if (!acc.cities[cityKey]) {
        acc.cities[cityKey] = {
          name: location.city,
          lat: location.latitude,
          lng: location.longitude,
          activations: 0,
          averageSales: 0,
          totalStores: 0,
          totalSales: 0,
        }
      }

      // Procesar datos de la tienda
      const storeKey = location.code
      if (!acc.stores[storeKey]) {
        acc.stores[storeKey] = {
          name: location.name,
          address: location.address,
          city: location.city,
          state: location.state,
          lat: location.latitude,
          lng: location.longitude,
          activations: 0,
          averageSales: 0,
          totalSales: 0,
        }
        // Incrementar el contador de tiendas en la ciudad
        acc.cities[cityKey].totalStores++
      }

      // Actualizar contadores
      acc.cities[cityKey].activations++
      acc.cities[cityKey].totalSales += submission.totalQuantity || 0
      acc.cities[cityKey].averageSales = Math.round(
        acc.cities[cityKey].totalSales / acc.cities[cityKey].activations,
      )

      acc.stores[storeKey].activations++
      acc.stores[storeKey].totalSales += submission.totalQuantity || 0
      acc.stores[storeKey].averageSales = Math.round(
        acc.stores[storeKey].totalSales / acc.stores[storeKey].activations,
      )

      return acc
    },
    { cities: {}, stores: {} } as {
      cities: Record<
        string,
        {
          name: string
          lat: number
          lng: number
          activations: number
          averageSales: number
          totalStores: number
          totalSales: number
        }
      >
      stores: Record<
        string,
        {
          name: string
          address: string
          city: string
          state: string
          lat: number
          lng: number
          activations: number
          averageSales: number
          totalSales: number
        }
      >
    },
  )

  return {
    citiesData: Object.values(locationMap.cities),
    storesData: Object.values(locationMap.stores),
  }
}
