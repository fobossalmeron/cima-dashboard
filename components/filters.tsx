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

export function Filters() {
  const [selectedBrands, setSelectedBrands] = React.useState<string[]>([])

  const brandOptions = [
    { value: "raptor", label: "Raptor" },
    { value: "del-frutal", label: "Del Frutal" },
    { value: "naturas", label: "Naturas" },
    { value: "senorial", label: "Señorial" }
  ]

  return (
    <div className="flex items-center gap-2">
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
          <SelectItem value="ciudad1">Ciudad 1</SelectItem>
          <SelectItem value="ciudad2">Ciudad 2</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-auto min-w-[100px]">
          <SelectValue placeholder="Dirección" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="direccion1">Dirección 1</SelectItem>
          <SelectItem value="direccion2">Dirección 2</SelectItem>
        </SelectContent>
      </Select>
      <Button>
        <Download className="mr-2 h-4 w-4" />
        Descargar
      </Button>
    </div>
  )
}