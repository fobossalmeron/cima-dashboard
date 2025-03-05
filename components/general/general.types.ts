export interface BaseLocation {
    name: string;
    lat: number;
    lng: number;
    activations: number;
    averageSales: number;
}

export interface StoreLocation extends BaseLocation {
    city: string;
    state: string;
    address: string;
}

export interface CityLocation extends BaseLocation {
    totalStores: number;
}

export interface MapsData {
    citiesData: CityLocation[];
    storesData: StoreLocation[];
}
export interface KpisData {
    activations: number;
    locationsVisited: number;
    samplesDelivered: number;
    unitsSold: number;
    conversion: number;
    velocity: number;
    nps: number;
    followings: number;
}

export interface ActivationSalesChartData {
    month: string;
    activations: number;
    totalSales: number;
    averageSales: number;
}