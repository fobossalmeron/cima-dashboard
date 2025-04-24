'use client'

import { createContext, useContext, useState } from 'react'
import { Option } from '@/types'

interface CatalogProviderProps {
  children: React.ReactNode
  giveawayProductTypes: Option[]
}

interface CatalogContextType {
  giveawayProductTypes: Option[]
  setGiveawayProductTypes: (giveawayProductTypes: Option[]) => void
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined)

export function CatalogProvider({
  children,
  giveawayProductTypes: initialGiveawayProductTypes,
}: CatalogProviderProps) {
  const [giveawayProductTypes, setGiveawayProductTypes] = useState<Option[]>(
    initialGiveawayProductTypes,
  )

  return (
    <CatalogContext.Provider
      value={{ giveawayProductTypes, setGiveawayProductTypes }}
    >
      {children}
    </CatalogContext.Provider>
  )
}

export function useCatalogContext() {
  const context = useContext(CatalogContext)
  if (context === undefined) {
    throw new Error('useCatalogContext must be used within a CatalogProvider')
  }
  return context
}
