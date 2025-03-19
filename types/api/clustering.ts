export interface TextGroup {
  baseName: string
  items: string[]
  indexes: number[]
  similarity: number
}

export interface ItemWithGroup {
  item: string
  group: TextGroup | null
}

export interface ClusteringResponse {
  items: ItemWithGroup[]
  groups: TextGroup[]
}
