'use client'

import { useState, useEffect } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce'
import { fetchAutocomplete } from './fetch'
import { AutocompleteProps } from './types'
import { Option } from '@/types'

export function Autocomplete({
  options = [],
  value,
  onValueChange,
  placeholder = 'Buscar...',
  emptyText = 'No se encontraron resultados.',
  className,
  searchConfig,
  debounceMs = 300,
}: AutocompleteProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<Option[]>([])
  const debouncedSearch = useDebounce(searchTerm, debounceMs)

  // Efecto para manejar la búsqueda
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedSearch) {
        setSearchResults([])
        return
      }

      try {
        setIsLoading(true)
        const results = await fetchAutocomplete(
          debouncedSearch,
          searchConfig,
          options,
        )
        console.log('Results', results)
        setSearchResults(results)
      } catch (error) {
        console.error('Error en la búsqueda:', error)
        setSearchResults([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [debouncedSearch])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setIsOpen(true)
  }

  const handleSelect = (option: Option) => {
    setSearchTerm(option.label)
    onValueChange(option.value)
    setIsOpen(false)
  }

  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false)
    }, 200)
  }

  return (
    <div className="relative">
      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={handleBlur}
        className={cn('w-full', className)}
      />
      {isOpen && searchTerm && (
        <div className="absolute z-50 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in top-10">
          {isLoading ? (
            <div className="flex items-center justify-center p-2">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-2 text-sm text-muted-foreground">{emptyText}</div>
          ) : (
            <div className="max-h-[200px] overflow-auto">
              {searchResults.map((option) => (
                <div
                  key={option.value}
                  className="flex cursor-pointer items-center px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground justify-between"
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                  <Check
                    className={cn(
                      'h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
