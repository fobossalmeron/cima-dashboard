export interface AgeDistributionChartData {
    ageRange: "18-24" | "25-34" | "35-44" | "45-54" | "55-64" | "65+";
    consumers: number;
}

export interface GenderDistributionChartData {
    gender: string;
    quantity: number;
}

export interface EthnicityDistributionChartData {
    ethnicity: string;
    quantity: number;
}

export interface PurchaseFactorsChartData {
    factor: string;
    quantity: number;
}

export interface ConsumptionMomentsChartData {
    moment: string;
    quantity: number;
}

