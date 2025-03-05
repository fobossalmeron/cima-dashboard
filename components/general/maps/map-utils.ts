import { BaseLocation } from "@/components/general/general.types";

interface MapBounds {
    north: number;
    south: number;
    east: number;
    west: number;
}

interface MapSettings {
    center: {
        lat: number;
        lng: number;
    };
    zoom: number;
}

/**
 * Calcula el centro y zoom óptimo para mostrar todas las ubicaciones en el mapa
 * 
 * @param locations Array de ubicaciones con coordenadas lat/lng
 * @returns Configuración del mapa con centro y zoom
 */
export function calculateMapSettings(locations: BaseLocation[]): MapSettings {
    // Valores predeterminados si no hay ubicaciones
    if (locations.length === 0) {
        return { center: { lat: 41.3083, lng: -72.9279 }, zoom: 8 };
    }

    // Si solo hay un punto, centramos en él con un zoom predeterminado
    if (locations.length === 1) {
        return {
            center: { lat: locations[0].lat, lng: locations[0].lng },
            zoom: 12
        };
    }

    // Calculamos los límites de todas las ubicaciones
    const bounds = locations.reduce(
        (acc, location) => {
            return {
                north: Math.max(acc.north, location.lat),
                south: Math.min(acc.south, location.lat),
                east: Math.max(acc.east, location.lng),
                west: Math.min(acc.west, location.lng),
            };
        },
        { north: -90, south: 90, east: -180, west: 180 } as MapBounds
    );

    // Calculamos el centro
    const center = {
        lat: (bounds.north + bounds.south) / 2,
        lng: (bounds.east + bounds.west) / 2,
    };

    // Calculamos un zoom que permita ver todos los puntos
    const latDistance = bounds.north - bounds.south;
    const lngDistance = bounds.east - bounds.west;
    const maxDistance = Math.max(latDistance, lngDistance);

    // Convertimos la distancia a un nivel de zoom aproximado
    let zoom = 12; // Valor predeterminado para distancias muy pequeñas

    if (maxDistance > 10) zoom = 6;
    else if (maxDistance > 5) zoom = 7;
    else if (maxDistance > 3) zoom = 8;
    else if (maxDistance > 1) zoom = 9;
    else if (maxDistance > 0.5) zoom = 10;
    else if (maxDistance > 0.2) zoom = 11;
    else if (maxDistance > 0.1) zoom = 12;

    // Aseguramos que el zoom sea un número entero
    // En lugar de restar 0.5, restamos 1 para asegurar que todos los puntos sean visibles
    zoom = Math.max(6, Math.floor(zoom - 1));

    return { center, zoom };
}

/**
 * Calcula las opciones de estilo para los círculos en el mapa
 * 
 * @param location Ubicación para la que se calculan las opciones
 * @param minSales Valor mínimo de ventas en el conjunto de datos
 * @param maxSales Valor máximo de ventas en el conjunto de datos
 * @param mapType Tipo de mapa (city o pointOfSale)
 * @returns Opciones de estilo para el círculo
 */
export function getCircleOptions(
    location: BaseLocation,
    minSales: number,
    maxSales: number,
    mapType: string
) {
    // Calculamos el percentil de ventas para determinar el color
    const salesPercentage =
        (location.averageSales - minSales) / (maxSales - minSales || 1);

    let color: string;
    if (salesPercentage <= 0.25) {
        color = "#FF4D4D"; // Rojo para ventas bajas
    } else if (salesPercentage <= 0.4) {
        color = "#FFA500"; // Naranja para ventas medio-bajas
    } else if (salesPercentage <= 0.65) {
        color = "#FFD700"; // Amarillo para ventas medio-altas
    } else {
        color = "#32CD32"; // Verde para ventas altas
    }

    return {
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.35,
        zIndex: 1,
        radius:
            mapType === "city"
                ? location.activations * 400
                : location.activations * 3000,
    };
} 