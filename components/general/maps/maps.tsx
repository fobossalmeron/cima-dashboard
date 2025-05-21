'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  GoogleMap,
  useJsApiLoader,
  Circle,
  InfoWindow,
} from '@react-google-maps/api'
import { mapStyles } from './map-styles'
import {
  BaseLocation,
  StoreLocation,
  CityLocation,
  MapsData,
} from '@/components/general/general.types'
import { calculateMapSettings, getCircleOptions } from './map-utils'

/**
 * Componente que muestra mapas interactivos de ciudades y puntos de venta con datos de ventas y activaciones.
 *
 * @param {MapsData} props.data
 * @property {StoreLocation[]} data.storesData - Array de ubicaciones de tiendas
 * @property {CityLocation[]} data.citiesData - Array de ubicaciones de ciudades
 *
 * BaseLocation contiene las propiedades comunes para todas las ubicaciones:
 * @property {number} lat - Latitud de la ubicación
 * @property {number} lng - Longitud de la ubicación
 * @property {string} name - Nombre de la ciudad o tienda
 * @property {number} activations - Número de activaciones en la ubicación
 * @property {number} averageSales - Promedio de ventas en la ubicación (ventas totales / número de activaciones)
 *
 * StoreLocation extiende BaseLocation con:
 * @property {string} city - Ciudad de la tienda
 * @property {string} state - Estado de la tienda
 * @property {string} address - Dirección de la tienda
 *
 * CityLocation extiende BaseLocation con:
 * @property {number} totalStores - Número total de tiendas en la ciudad
 */

export function Maps({ data }: { data: MapsData }) {
  const [mapType, setMapType] = useState('pointOfSale')
  const [selectedLocation, setSelectedLocation] = useState<BaseLocation | null>(
    null,
  )

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  })

  const currentData = useMemo(() => {
    const dataToUse = mapType === 'city' ? data.citiesData : data.storesData
    // Filtra ubicaciones con lat/lng válidos
    return dataToUse.filter((loc) => loc.lat && loc.lng)
  }, [mapType, data])

  const maxSales = useMemo(() => {
    return Math.max(...currentData.map((location) => location.averageSales))
  }, [currentData])

  const minSales = useMemo(() => {
    return Math.min(...currentData.map((location) => location.averageSales))
  }, [currentData])

  const maxActivations = useMemo(() => {
    return Math.max(...currentData.map((location) => location.activations))
  }, [currentData])

  // Calculamos el centro y zoom del mapa
  const mapSettings = useMemo(() => {
    return calculateMapSettings(currentData)
  }, [currentData])

  const renderInfoWindow = (location: BaseLocation) => {
    if (mapType === 'city') {
      const cityLoc = location as CityLocation
      return (
        <div className="p-2">
          <h3 className="font-bold mb-2">{location.name}</h3>
          <p>Tiendas: {cityLoc.totalStores}</p>
          <p>Activaciones: {location.activations}</p>
          <p>Promedio de ventas: {location.averageSales}</p>
        </div>
      )
    } else {
      const storeLoc = location as StoreLocation
      return (
        <div className="p-2">
          <h3 className="font-bold mb-2">
            {location.name} - {storeLoc.address}
          </h3>
          <p>Activaciones: {location.activations}</p>
          <p>Promedio de ventas: {location.averageSales}</p>
        </div>
      )
    }
  }

  const handleMapTypeChange = (newType: string) => {
    setMapType(newType)
    setSelectedLocation(null)
  }

  if (loadError) return <div>Error al cargar el mapa</div>
  if (!isLoaded) return <div>Cargando mapa...</div>

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Mapas de ciudades y puntos de venta</span>
          <Select value={mapType} onValueChange={handleMapTypeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar vista" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="city">Por ciudad</SelectItem>
              <SelectItem value="pointOfSale">Por punto de venta</SelectItem>
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <GoogleMap
          key={mapType}
          mapContainerStyle={{ width: '100%', height: '400px' }}
          center={mapSettings.center}
          zoom={mapSettings.zoom}
          options={{
            styles: mapStyles,
            disableDefaultUI: true,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
          }}
        >
          {currentData.map((location, index) => {
            return (
              <Circle
                key={`${mapType}-${index}`}
                center={{ lat: location.lat, lng: location.lng }}
                options={getCircleOptions(
                  location,
                  minSales,
                  maxSales,
                  mapType,
                )}
                onClick={() => setSelectedLocation(location)}
              />
            )
          })}
          {selectedLocation && (
            <InfoWindow
              position={{
                lat: selectedLocation.lat,
                lng: selectedLocation.lng,
              }}
              onCloseClick={() => setSelectedLocation(null)}
            >
              {renderInfoWindow(selectedLocation)}
            </InfoWindow>
          )}
        </GoogleMap>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>No. demos</span>
            <div className="flex items-center gap-2">
              <span>1</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full border border-gray-400 bg-gray-300/50"></div>
                <div className="w-4 h-4 rounded-full border border-gray-400 bg-gray-300/50"></div>
                <div className="w-5 h-5 rounded-full border border-gray-400 bg-gray-300/50"></div>
              </div>
              <span>{maxActivations}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span>Promedio de ventas</span>
            <div className="flex items-center gap-1">
              <span>{minSales}</span>
              <div className="w-16 h-2 bg-gradient-to-r from-[#FF4D4D] via-[#FFD700] to-[#32CD32]"></div>
              <span>{maxSales}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
