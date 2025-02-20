"use client"

import { useState, useMemo } from "react"
import { GoogleMap, useJsApiLoader, Circle, InfoWindow } from "@react-google-maps/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const containerStyle = {
  width: "100%",
  height: "400px",
}

const center = {
  lat: 38.9072,
  lng: -77.0369,
}

// Estilos actualizados para un mapa minimalista oscuro
const darkMapStyles = [
  // {
  //   featureType: "all",
  //   elementType: "labels",
  //   stylers: [{ visibility: "off" }],
  // },
  // {
  //   featureType: "administrative",
  //   elementType: "geometry",
  //   stylers: [{ visibility: "off" }],
  // },
  // {
  //   featureType: "landscape",
  //   elementType: "geometry",
  //   stylers: [{ color: "#242f3e" }],
  // },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],  // Bosques en blanco
  },
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
    //Este quita todos los puntos de interés
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }, { lightness: -10 }],
  },
  {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],  // Esto quita los iconos de las carreteras
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }],
  },
  // {
  //   featureType: "water",
  //   elementType: "geometry",
  //   stylers: [{ color: "#17263c" }],
  // },
]

const locationData = [
  {
    name: "Food Star - Leesburg Pike",
    city: "Bailey's Crossroads",
    state: "Virginia",
    lat: 38.847738723666,
    lng: -77.124325365385,
    activations: 1,
    sales: 123,
  },
  {
    name: "New Grand Mart",
    city: "New Carrollton",
    state: "Maryland",
    lat: 38.956085,
    lng: -76.8693663,
    activations: 1,
    sales: 36,
  },
  {
    name: "New Grand Mart #2",
    city: "Alexandria",
    state: "Virginia",
    lat: 38.8170309536734,
    lng: -77.1434305976915,
    activations: 1,
    sales: 124,
  },
  {
    name: "Megamart #3 - Riverdale Park",
    city: "Riverdale Park",
    state: "Maryland",
    lat: 38.9594684,
    lng: -76.9176808,
    activations: 1,
    sales: 30,
  },
  {
    name: "Global Food - Manassas",
    city: "Manassas",
    state: "Virginia",
    lat: 38.7796435248141,
    lng: -77.509701460972,
    activations: 1,
    sales: 65,
  },
  {
    name: "Megamart #1",
    city: "Takoma Park",
    state: "Maryland",
    lat: 38.9899958790611,
    lng: -76.9899147378313,
    activations: 2,
    sales: 178,
  },
  {
    name: "Atlantic Supermarket",
    city: "Hyattsville",
    state: "Maryland",
    lat: 38.9885302697115,
    lng: -76.9860835505914,
    activations: 1,
    sales: 192,
  },
  {
    name: "Glebe Market",
    city: "Arlington",
    state: "Virginia",
    lat: 38.8740479195106,
    lng: -77.105782827649,
    activations: 1,
    sales: 45,
  },
]

export function HeatMap() {
  const [mapType, setMapType] = useState("city")
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    city: string;
    state: string;
    lat: number;
    lng: number;
    activations: number;
    sales: number;
  } | null>(null)

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  })

  const averageSales = useMemo(() => {
    const total = locationData.reduce((sum, location) => sum + location.sales, 0)
    return total / locationData.length
  }, [])

  const getCircleOptions = (sales: number, activations: number) => ({
    strokeColor: sales > averageSales ? "#FFD700" : "#32CD32",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: sales > averageSales ? "#FFD700" : "#32CD32",
    fillOpacity: 0.35,
    radius: activations * 1000,
    zIndex: 1,
  })

  if (loadError) {
    return <div>Error al cargar el mapa</div>
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Mapa de calor de puntos de venta</span>
          <Select value={mapType} onValueChange={setMapType}>
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
      <CardContent>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={9}
            options={{
              styles: darkMapStyles,
              disableDefaultUI: true,
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            {locationData.map((location, index) => (
              <Circle
                key={index}
                center={{ lat: location.lat, lng: location.lng }}
                options={getCircleOptions(location.sales, location.activations)}
                onClick={() => setSelectedLocation(location)}
              />
            ))}
            {selectedLocation && (
              <InfoWindow
                position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                onCloseClick={() => setSelectedLocation(null)}
              >
                <div className="p-2">
                  <h3 className="font-bold mb-2">{selectedLocation.name}</h3>
                  <p>Activaciones: {selectedLocation.activations}</p>
                  <p>Ventas totales: {selectedLocation.sales}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <div>Cargando mapa...</div>
        )}
      </CardContent>
    </Card>
  )
}

