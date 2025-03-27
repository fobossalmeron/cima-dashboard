'use client'

import * as React from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Option {
  value: string
  label: string
}

interface SearchableSelectProps {
  options: Option[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  searchPlaceholder?: string
  noResultsText?: string
}

export function SearchableSelect({
  options = [],
  value,
  onChange,
  placeholder = 'Selecciona...',
  className,
  searchPlaceholder = 'Buscar...',
  noResultsText = 'No se encontraron resultados.',
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-auto min-w-[100px] justify-between font-normal',
            value ? 'text-foreground' : 'text-muted-foreground',
            className,
          )}
        >
          <span className="truncate">
            {value
              ? options.find((option) => option.value === value)?.label
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[300px] min-w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
        sideOffset={5}
        side="bottom"
        style={{
          position: 'absolute',
        }}
      >
        <div className="p-1">
          <input
            type="text"
            placeholder={searchPlaceholder}
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
                    onChange(option.value)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {option.label}
                </div>
              ))
            ) : (
              <div className="p-2 text-sm text-gray-500">{noResultsText}</div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
