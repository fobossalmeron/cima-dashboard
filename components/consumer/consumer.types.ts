export interface AgeDistributionChartData {
    ageRange: "18-24" | "25-34" | "35-44" | "45-54" | "55-64" | "65+";
    quantity: number;
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

export interface NetPromoterScoreChartData {
    vote: number;
    quantity: number;
}
export interface ConsumerFeedbackData {
    comment: string;
}
export interface ConsumerImagesData {
    locationName: string;
    address: string;
    url: string;
}