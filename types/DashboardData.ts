export interface ProductData {
  id: string
  name: string
  price: number
  sales: number
}

export interface ProductMetricsData {
  id: string
  price: number
  sales: number
  date: Date
  productId: string
  formId: string
  createdAt: Date
  updatedAt: Date
  product: {
    id: string
    name: string
    brand: {
      id: string
      name: string
    }
    subBrand?: {
      id: string
      name: string
    } | null
    presentation?: {
      id: string
      name: string
    } | null
    flavor?: {
      id: string
      name: string
    } | null
  }
}
