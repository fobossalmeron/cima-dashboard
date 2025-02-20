"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format, addDays } from "date-fns"
import { es } from "date-fns/locale"

function DatePicker({
  className,
  value,
  onChange,
}: {
  className?: string
  value?: { from: Date; to: Date }
  onChange?: (range?: { from: Date; to: Date }) => void
}) {
  const currentDate = new Date()
  const defaultRange = {
    from: new Date(2025, 0, 1), // 1 de enero de 2025
    to: currentDate
  }

  const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date }>(value || defaultRange)
  const [weekNumber, setWeekNumber] = React.useState<string>('')
  const [month, setMonth] = React.useState<Date>(dateRange?.from || new Date())

  const handleWeekSelection = (value: string) => {
    const week = parseInt(value)
    if (isNaN(week) || week < 1 || week > 52) return
    
    const year = new Date().getFullYear()
    const firstDayOfYear = new Date(year, 0, 1)
    const firstWeekDay = firstDayOfYear.getDay()
    const daysOffset = firstWeekDay > 0 ? 7 - firstWeekDay : 0
    const startOfWeek = new Date(year, 0, 1 + daysOffset + (week - 1) * 7)
    const endOfWeek = addDays(startOfWeek, 6)
    
    const newRange = { from: startOfWeek, to: endOfWeek }
    setDateRange(newRange)
    setMonth(startOfWeek)
    setWeekNumber(value)
    onChange?.(newRange)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !dateRange && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange ? (
            <>
              {format(dateRange.from, "LLL dd, y", { locale: es })} -{" "}
              {format(dateRange.to, "LLL dd, y", { locale: es })}
            </>
          ) : (
            <span>Selecciona un rango</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="flex items-center gap-2 mb-4 justify-center">
            Semana
          <Input
            type="number"
            min="1"
            max="52"
            value={weekNumber}
            onChange={(e) => handleWeekSelection(e.target.value)}
            placeholder="(1-52)"
            className="w-20"
          />
        </div>
        <Calendar
          mode="range"
          selected={dateRange}
          month={month}
          onMonthChange={setMonth}
          onSelect={(range) => {
            if (range?.from && range?.to) {
              setDateRange({ from: range.from, to: range.to })
              onChange?.({ from: range.from, to: range.to })
              setWeekNumber('')
            }
          }}
          initialFocus
          locale={es}
        />
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
