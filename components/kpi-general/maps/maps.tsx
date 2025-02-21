"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GoogleMap, useJsApiLoader, Circle, InfoWindow } from "@react-google-maps/api"
import { mapStyles } from "./map-styles"
import { locationData } from "@/data/dummy-locations";
import { cityData } from "@/data/dummy-cities";

// Interfaces base
interface BaseLocation {
  name: string;
  lat: number;
  lng: number;
  activations: number;
  sales: number;
}

interface StoreLocation extends BaseLocation {
  city: string;
  state: string;
}

interface CityLocation extends BaseLocation {
  totalStores: number;
}

const storeData: StoreLocation[] = locationData.map(loc => ({
  ...loc,
  city: loc.city,
  state: loc.state
}))

const cityLocationData: CityLocation[] = cityData.map(loc => ({
  ...loc,
  totalStores: loc.totalStores
}))

export function Maps() {
  const [mapType, setMapType] = useState("city")
  const [selectedLocation, setSelectedLocation] = useState<BaseLocation | null>(null)

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  })

  const currentData = mapType === "city" ? cityLocationData : storeData

  const averageSales = useMemo(() => {
    const total = currentData.reduce((sum, location) => sum + location.sales, 0)
    return total / currentData.length
  }, [currentData])

  const maxSales = useMemo(() => {
    return Math.max(...currentData.map(location => location.sales))
  }, [currentData])

  const minSales = useMemo(() => {
    return Math.min(...currentData.map(location => location.sales))
  }, [currentData])

  const maxActivations = useMemo(() => {
    return Math.max(...currentData.map(location => location.activations))
  }, [currentData])

  const getCircleOptions = (location: BaseLocation) => {
    const baseOptions = {
      strokeColor: location.sales > averageSales ? "#32CD32" : "#FFD700",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: location.sales > averageSales ? "#32CD32" : "#FFD700",
      fillOpacity: 0.35,
      zIndex: 1,
    }

    return {
      ...baseOptions,
      radius: mapType === "city" 
        ? location.activations * 400 
        : location.activations * 3000
    }
  }

  const renderInfoWindow = (location: BaseLocation) => {
    if (mapType === "city") {
      const cityLoc = location as CityLocation
      return (
        <div className="p-2">
          <h3 className="font-bold mb-2">{location.name}</h3>
          <p>Tiendas totales: {cityLoc.totalStores}</p>
          <p>Activaciones totales: {location.activations}</p>
          <p>Ventas totales: {location.sales}</p>
        </div>
      )
    } else {
      return (
        <div className="p-2">
          <h3 className="font-bold mb-2">{location.name}</h3>
          <p>Activaciones: {location.activations}</p>
          <p>Ventas totales: {location.sales}</p>
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
          mapContainerStyle={{ width: "100%", height: "400px" }}
          center={{ lat: 41.3083, lng: -72.9279 }}
          zoom={mapType === "city" ? 8 : 9}
          options={{
            styles: mapStyles,
            disableDefaultUI: true,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {currentData.map((location, index) => (
            <Circle
              key={`${mapType}-${index}`}
              center={{ lat: location.lat, lng: location.lng }}
              options={getCircleOptions(location)}
              onClick={() => setSelectedLocation(location)}
            />
          ))}
          {selectedLocation && (
            <InfoWindow
              position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
              onCloseClick={() => setSelectedLocation(null)}
            >
              {renderInfoWindow(selectedLocation)}
            </InfoWindow>
          )}
        </GoogleMap>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>No. Activaciones</span>
            <div className="flex items-center gap-1">
              <span>1</span>
              <div className="w-2 h-2 rounded-full border border-white/50"></div>
              <div className="w-3 h-3 rounded-full border border-white/50"></div>
              <div className="w-4 h-4 rounded-full border border-white/50"></div>
              <span>{maxActivations}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span>Promedio de Ventas</span>
            <div className="flex items-center gap-1">
              <span>{minSales}</span>
              <div className="w-16 h-2 bg-gradient-to-r from-[#FFD700] to-[#32CD32]"></div>
              <span>{maxSales}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

