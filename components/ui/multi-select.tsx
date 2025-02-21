"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function MultiSelect({
  options = [],
  selected = [],
  onChange,
  placeholder = "Selecciona...",
  className,
}: {
  options?: { value: string; label: string }[]
  selected?: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const safeSelected = Array.isArray(selected) ? selected : []

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("min-w-[100px] justify-between font-normal", {
            "text-muted-foreground": safeSelected.length === 0
          }, className)}
        >
          <span className="truncate">
            {safeSelected.length > 0
              ? options
                  .filter(option => safeSelected.includes(option.value))
                  .map(option => option.label)
                  .join(", ")
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <div className="p-1">
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border rounded mb-1 text-sm"
          />
          <div className="max-h-[200px] overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center p-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    const newSelected = safeSelected.includes(option.value)
                      ? safeSelected.filter(value => value !== option.value)
                      : [...safeSelected, option.value]
                    onChange(newSelected)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      safeSelected.includes(option.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option.label}
                </div>
              ))
            ) : (
              <div className="p-2 text-sm text-gray-500">
                No se encontraron resultados
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
} 