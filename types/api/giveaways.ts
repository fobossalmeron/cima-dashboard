export interface GiveawayProductData {
  type: string
  quantity: number
  submissionId: string
  submissionDate: Date
}

export interface GroupedGiveawayData {
  type: string
  totalQuantity: number
  submissions: {
    submissionId: string
    submissionDate: Date
    quantity: number
  }[]
}
