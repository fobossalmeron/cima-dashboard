"use client"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "@/components/ui/datepicker"
import { Download } from "lucide-react"
import { MultiSelect } from "@/components/ui/multi-select"
import React from "react"

export function Filters({className}: {className?: string}) {
  const [selectedBrands, setSelectedBrands] = React.useState<string[]>([])

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

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <DatePicker />
      <MultiSelect
        options={brandOptions}
        selected={selectedBrands}
        onChange={setSelectedBrands}
        placeholder="Marca"
      />
      <Select>
        <SelectTrigger className="w-auto min-w-[100px]">
          <SelectValue placeholder="Ciudad" />
        </SelectTrigger>
        <SelectContent>
          {cityOptions.map((city) => (
            <SelectItem key={city.value} value={city.value}>
              {city.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-auto min-w-[100px]">
          <SelectValue placeholder="Punto de venta" />
        </SelectTrigger>
        <SelectContent>
          {directionOptions.map((direction) => (
            <SelectItem key={direction.value} value={direction.value}>
              {direction.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button>
        <Download className="mr-2 h-4 w-4" />
        Descargar
      </Button>
    </div>
  )
}