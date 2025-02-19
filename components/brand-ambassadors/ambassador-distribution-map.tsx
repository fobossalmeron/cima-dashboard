"use client"

import { useState } from "react"
import { GoogleMap, useJsApiLoader, Circle, InfoWindow } from "@react-google-maps/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const center = {
  lat: 40.7128,
  lng: -74.006,
}

const darkMapStyles = [
  {
    featureType: "all",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#242f3e" }],
  },
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }, { lightness: -20 }],
  },
  {
    featureType: "road",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
]

const ambassadorData = [
  {
    name: "Ana García",
    city: "Nueva York",
    activations: 25,
    sales: 2800,
    lat: 40.7128,
    lng: -74.006,
  },
  {
    name: "María Rodríguez",
    city: "Los Ángeles",
    activations: 18,
    sales: 2100,
    lat: 34.0522,
    lng: -118.2437,
  },
  {
    name: "Laura Martínez",
    city: "Chicago",
    activations: 22,
    sales: 2500,
    lat: 41.8781,
    lng: -87.6298,
  },
]

export function AmbassadorDistributionMap() {
  const [selectedAmbassador, setSelectedAmbassador] = useState(null)
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  })

  const getCircleOptions = (sales: number) => ({
    strokeColor: "#8884d8",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#8884d8",
    fillOpacity: 0.35,
    radius: Math.sqrt(sales) * 100,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de embajadoras</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={center}
            zoom={4}
            options={{
              styles: darkMapStyles,
              disableDefaultUI: true,
              zoomControl: true,
            }}
          >
            {ambassadorData.map((ambassador, index) => (
              <Circle
                key={index}
                center={{ lat: ambassador.lat, lng: ambassador.lng }}
                options={getCircleOptions(ambassador.sales)}
                onClick={() => setSelectedAmbassador(ambassador)}
              />
            ))}
            {selectedAmbassador && (
              <InfoWindow
                position={{ lat: selectedAmbassador.lat, lng: selectedAmbassador.lng }}
                onCloseClick={() => setSelectedAmbassador(null)}
              >
                <div className="p-2">
                  <h3 className="font-bold mb-2">{selectedAmbassador.name}</h3>
                  <p>Ciudad: {selectedAmbassador.city}</p>
                  <p>Activaciones: {selectedAmbassador.activations}</p>
                  <p>Ventas: ${selectedAmbassador.sales.toLocaleString()}</p>
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

