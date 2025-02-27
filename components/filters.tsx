"use client"

import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/datepicker"
import { Download } from "lucide-react"
import { MultiSelect } from "@/components/ui/multi-select"
import { SearchableSelect } from "@/components/ui/searchable-select"
import React from "react"

export function Filters({className}: {className?: string}) {
  const [selectedBrands, setSelectedBrands] = React.useState<string[]>([])
  const [selectedCity, setSelectedCity] = React.useState<string>()
  const [selectedLocation, setSelectedLocation] = React.useState<string>()

  const brandOptions = [
    { value: "raptor", label: "Raptor" },
    { value: "del-frutal", label: "Del Frutal" },
    { value: "naturas", label: "Naturas" },
  ]

  const cityOptions = [
    { value: "stamford", label: "Stamford, CT" },
    { value: "bridgeport", label: "Bridgeport, CT" },
    { value: "new-haven", label: "New Haven, CT" },
  ]

  const directionOptions = [
    { value: "new-haven-1", label: "New Haven Grocery - 240 NE 8th St, New Haven, FL 33030" },
    { value: "stamford-1", label: "Stamford Market - 1 Atlantic St, Stamford, CT 06901" },
    { value: "bridgeport-1", label: "Bridgeport Superstore - 500 Broad St, Bridgeport, CT 06604" },
    { value: "new-haven-2", label: "New Haven Deli - 900 Chapel St, New Haven, CT 06510" },
    { value: "stamford-2", label: "Stamford Groceries - 300 Tresser Blvd, Stamford, CT 06901" },
  ]

  // Asegurarse de que las opciones nunca sean undefined
  const safeDirectionOptions = selectedCity 
    ? directionOptions.filter(option => option.value.startsWith(selectedCity))
    : directionOptions

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <DatePicker />
      <MultiSelect
        options={brandOptions}
        selected={selectedBrands}
        onChange={setSelectedBrands}
        placeholder="Marca"
      />
      <SearchableSelect
        options={cityOptions || []}
        value={selectedCity}
        onChange={setSelectedCity}
        placeholder="Ciudad"
        searchPlaceholder="Buscar ciudad..."
      />
      <SearchableSelect
        options={safeDirectionOptions || []}
        value={selectedLocation}
        onChange={setSelectedLocation}
        placeholder="Punto de venta"
        searchPlaceholder="Buscar punto de venta..."
      />
      <Button>
        <Download className="mr-2 h-4 w-4" />
        Descargar
      </Button>
    </div>
  )
}