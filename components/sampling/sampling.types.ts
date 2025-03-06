export type WeekDay = "Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes" | "Sábado" | "Domingo";

export type HeatmapDataStructure = Record<WeekDay, {
    [hour: number]: number;
}>;

export interface ActivationsHistoryTableData {
    date: string;
    brand: string;
    locationName: string;
    address: string;
    sales: number;
    velocity: number;
}

export interface PromoterImageData {
    url: string;
    name: string;
}