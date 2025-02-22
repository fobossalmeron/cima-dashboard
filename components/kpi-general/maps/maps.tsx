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
  const [mapType, setMapType] = useState("pointOfSale")
  const [selectedLocation, setSelectedLocation] = useState<BaseLocation | null>(null)

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  })

  const currentData = mapType === "city" ? cityLocationData : storeData

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
    // Calculamos el percentil de ventas para determinar el color
    const salesPercentage = (location.sales - minSales) / (maxSales - minSales)
    
    let color: string;
    if (salesPercentage <= 0.25) {
      color = "#FF4D4D" // Rojo para ventas bajas
    } else if (salesPercentage <= 0.4) {
      color = "#FFA500" // Naranja para ventas medio-bajas
    } else if (salesPercentage <= 0.65) {
      color = "#FFD700" // Amarillo para ventas medio-altas
    } else {
      color = "#32CD32" // Verde para ventas altas
    }

    return {
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.35,
      zIndex: 1,
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
            <span>No. activaciones</span>
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
              <div className="w-16 h-2 bg-gradient-to-r from-[#FF4D4D] via-[#FFA500] via-[#FFD700] to-[#32CD32]"></div>
              <span>{maxSales}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

