export interface ProductData {
  id: string;
  name: string;
  price: number;
  sales: number;
}

export interface DashboardData {
  [key: string]: ProductData;
}