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
  const today = new Date()

  const presets: PresetRange[] = [
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
  ]

  const [selectedRange, setSelectedRange] = React.useState<DateRange>(
    value || presets[0].value,
  )
  const [month, setMonth] = React.useState<Date>(selectedRange.from)

  const handleSelectPreset = (presetLabel: string) => {
    const preset = presets.find((p) => p.label === presetLabel)
    if (preset) {
      setSelectedRange(preset.value)
      onChange?.(preset.value)
    }
  }

  React.useEffect(() => {
    if (value && value !== selectedRange) {
      setSelectedRange(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <Popover>
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
      <PopoverContent className="w-auto p-3" align="start">
        <div className="space-y-3">
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
          <Calendar
            mode="range"
            selected={selectedRange}
            month={month}
            onMonthChange={setMonth}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                const currentFrom = new Date(selectedRange.from).setHours(
                  0,
                  0,
                  0,
                  0,
                )
                const currentTo = new Date(selectedRange.to).setHours(
                  0,
                  0,
                  0,
                  0,
                )
                const newFrom = new Date(range.from).setHours(0, 0, 0, 0)

                if (currentFrom !== currentTo) {
                  // Si el rango actual tiene fechas diferentes, usar la fecha que seleccionó el usuario
                  // Si la fecha seleccionada es menor que el rango actual, usar range.from
                  // Si la fecha seleccionada es mayor que el rango actual, usar range.to
                  const selectedDate =
                    newFrom < currentFrom ? range.from : range.to
                  const newRange = { from: selectedDate, to: selectedDate }
                  setSelectedRange(newRange)
                  onChange?.(newRange)
                } else {
                  // Si el nuevo rango es del mismo día, permitir seleccionar un nuevo rango
                  const newRange = { from: range.from, to: range.to }
                  setSelectedRange(newRange)
                  onChange?.(newRange)
                }
              }
            }}
            initialFocus
            locale={es}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
