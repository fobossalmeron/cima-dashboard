export interface ProductStatusInPDVChartData {
    type: "En promoción" | "Precio regular";
    quantity: number;
}
export interface ProductLocationInPDVChartData {
    location: string;
    quantity: number;
}

export interface PDVTypeChartData {
    type: string;
    quantity: number;
}

export interface PDVProductImagesData {
    locationName: string;
    address: string;
    url: string;
}
export interface OldAndNewActivationsChartData {
    month: string;
    new_location_activations: number;
    previous_location_activations: number;
    new_locations: number;
    previous_locations: number;
}

export interface AveragePriceInPDVChartData {
    brand: string;
    averagePrice: number;
}