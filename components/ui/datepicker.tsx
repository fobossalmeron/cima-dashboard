'use client'

import * as React from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format, subDays, subMonths, startOfYear } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type DateRange = {
  from: Date
  to: Date
}

type PresetRange = {
  label: string
  value: DateRange
}

function DatePicker({
  className,
  value,
  onChange,
}: {
  className?: string
  value?: DateRange
  onChange?: (range: DateRange) => void
}) {
  const today = React.useMemo(() => new Date(), [])
  const [isOpen, setIsOpen] = React.useState(false)
  const [isDebouncing, setIsDebouncing] = React.useState(false)
  const [tempRange, setTempRange] = React.useState<DateRange | undefined>(
    undefined,
  )
  const [startMonth, setStartMonth] = React.useState<Date>(today)
  const [endMonth, setEndMonth] = React.useState<Date>(today)

  const presets: PresetRange[] = React.useMemo(
    () => [
      {
        label: 'Últimos 7 días',
        value: {
          from: subDays(today, 7),
          to: today,
        },
      },
      {
        label: 'Último mes',
        value: {
          from: subMonths(today, 1),
          to: today,
        },
      },
      {
        label: 'Últimos 3 meses',
        value: {
          from: subMonths(today, 3),
          to: today,
        },
      },
      {
        label: 'Lo que va del año',
        value: {
          from: startOfYear(today),
          to: today,
        },
      },
    ],
    [today],
  )

  const [selectedRange, setSelectedRange] = React.useState<DateRange>(
    value || presets[0].value,
  )

  const handleSelectPreset = React.useCallback(
    (presetLabel: string) => {
      const preset = presets.find((p) => p.label === presetLabel)
      if (preset) {
        const adjustedPreset = {
          from: new Date(new Date(preset.value.from).setHours(0, 0, 0, 0)),
          to: new Date(new Date(preset.value.to).setHours(23, 59, 59, 999)),
        }
        setTempRange(adjustedPreset)

        // Actualizar los meses mostrados en cada calendario
        setStartMonth(adjustedPreset.from)
        setEndMonth(adjustedPreset.to)
      }
    },
    [presets],
  )

  React.useEffect(() => {
    if (value && value !== selectedRange) {
      setSelectedRange(value)
      setTempRange(value)

      // Actualizar los meses mostrados cuando se recibe un valor
      if (value.from) setStartMonth(value.from)
      if (value.to) setEndMonth(value.to)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  React.useEffect(() => {
    if (!tempRange && selectedRange) {
      setTempRange(selectedRange)

      // Inicializar los meses mostrados con el rango seleccionado
      setStartMonth(selectedRange.from)
      setEndMonth(selectedRange.to)
    }
  }, [tempRange, selectedRange, isOpen])

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      if (isDebouncing) return

      setIsDebouncing(true)

      if (open) {
        setTempRange(selectedRange)

        // Al abrir, actualizar los meses mostrados
        setStartMonth(selectedRange.from)
        setEndMonth(selectedRange.to)
      }

      setIsOpen(open)

      setTimeout(() => {
        setIsDebouncing(false)
      }, 300)
    },
    [isDebouncing, selectedRange],
  )

  const handleSelectStartDate = (date: Date | undefined) => {
    if (!date) return

    // Ajustar las horas para el inicio del día
    const adjustedDate = new Date(new Date(date).setHours(0, 0, 0, 0))

    setTempRange((prev) => {
      if (!prev) {
        return { from: adjustedDate, to: adjustedDate }
      }

      return { ...prev, from: adjustedDate }
    })
  }

  const handleSelectEndDate = (date: Date | undefined) => {
    if (!date) return

    // Ajustar las horas para el final del día
    const adjustedDate = new Date(new Date(date).setHours(23, 59, 59, 999))

    setTempRange((prev) => {
      if (!prev) {
        return { from: adjustedDate, to: adjustedDate }
      }

      return { ...prev, to: adjustedDate }
    })
  }

  const handleApply = () => {
    if (tempRange) {
      // Asegurarnos de que las horas estén correctamente ajustadas antes de aplicar el cambio
      const adjustedRange = {
        from: new Date(new Date(tempRange.from).setHours(0, 0, 0, 0)),
        to: new Date(new Date(tempRange.to).setHours(23, 59, 59, 999)),
      }
      setSelectedRange(adjustedRange)
      onChange?.(adjustedRange)
    }
    setIsOpen(false)
  }

  const handleCancel = () => {
    setTempRange(selectedRange)
    setIsOpen(false)
  }

  // Agregar este effect para depurar los cambios de tempRange
  React.useEffect(() => {
    if (tempRange) {
      console.log('tempRange actualizado:', {
        from: tempRange.from.toISOString(),
        to: tempRange.to.toISOString(),
      })
    }
  }, [tempRange])

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-[240px] justify-start text-left font-normal',
            !selectedRange && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedRange ? (
            <>
              {format(selectedRange.from, 'dd MMM yyyy', { locale: es })} -{' '}
              {format(selectedRange.to, 'dd MMM yyyy', { locale: es })}
            </>
          ) : (
            <span>Selecciona un rango</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-3 max-w-[330px] md:max-w-[600px] w-auto flex flex-col"
        align="start"
        sideOffset={5}
        side="bottom"
        style={{
          position: 'absolute',
        }}
      >
        <div className="space-y-3 w-full self-start justify-self-start">
          <Select onValueChange={handleSelectPreset}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un rango" />
            </SelectTrigger>
            <SelectContent>
              {presets.map((preset) => (
                <SelectItem key={preset.label} value={preset.label}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div
            className="w-full overflow-x-auto"
            onWheel={(e) => {
              e.stopPropagation()
            }}
            onTouchMove={(e) => {
              e.stopPropagation()
            }}
          >
            <div className="grid grid-cols-2 gap-4 w-[500px] justify-start self-start justify-self-start">
              <div className="w-full flex flex-col items-center">
                <div className="mb-2 text-center text-sm font-medium bg-gray-100 rounded-md p-2 w-full">
                  Fecha inicial
                </div>
                <Calendar
                  key={`start-${tempRange?.from?.toISOString() || 'empty'}`}
                  mode="single"
                  selected={tempRange?.from}
                  onSelect={handleSelectStartDate}
                  month={startMonth}
                  onMonthChange={setStartMonth}
                  initialFocus
                  locale={es}
                  disabled={(date) => {
                    // No permitir fechas futuras
                    if (date > new Date()) return true
                    // No permitir fechas posteriores a la fecha final seleccionada
                    if (tempRange?.to && date > tempRange.to) return true
                    return false
                  }}
                />
              </div>
              <div className="w-full flex flex-col items-center">
                <div className="mb-2 text-center text-sm font-medium bg-gray-100 rounded-md p-2 w-full">
                  Fecha final
                </div>
                <Calendar
                  key={`end-${tempRange?.to?.toISOString() || 'empty'}`}
                  mode="single"
                  selected={tempRange?.to}
                  onSelect={handleSelectEndDate}
                  month={endMonth}
                  onMonthChange={setEndMonth}
                  // initialFocus
                  locale={es}
                  disabled={(date) => {
                    // No permitir fechas futuras
                    if (date > new Date()) return true
                    // No permitir fechas anteriores a la fecha inicial seleccionada
                    if (tempRange?.from && date < tempRange.from) return true
                    return false
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button variant="default" onClick={handleApply}>
              Aplicar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
