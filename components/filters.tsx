'use client'

import { useEffect, useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { DatePicker, DateRange } from '@/components/ui/datepicker'
import { Download } from 'lucide-react'
import { MultiSelect } from '@/components/ui/multi-select'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { toast } from 'sonner'
import { useClientContext } from '@/lib/context/ClientContext'
import { useQuery } from '@tanstack/react-query'
import { Brand, Location } from '@prisma/client'
import { useDashboard } from '@/lib/hooks/use-dashboard'

export function Filters({
  className,
  mobile,
}: {
  className?: string
  mobile?: boolean
}) {
  const { dashboardData, setDashboardData } = useClientContext()
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedCity, setSelectedCity] = useState<string | undefined>(
    undefined,
  )
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(
    undefined,
  )
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [
    firstNonNullDashboardDataLoading,
    setFirstNonNullDashboardDataLoading,
  ] = useState<boolean>(false)

  // Obtener las marcas
  const { data } = useQuery({
    queryKey: ['filters'],
    queryFn: async () => {
      const response = await fetch(
        `/api/dashboard/${dashboardData?.id}/filters`,
      )
      const data = await response.json()
      return data
    },
  })

  const filters = useMemo(
    () => ({
      brandIds: selectedBrands,
      city: selectedCity,
      locationId: selectedLocation,
      dateRange: dateRange
        ? {
            startDate: dateRange.from,
            endDate: dateRange.to,
          }
        : undefined,
    }),
    [selectedBrands, selectedCity, selectedLocation, dateRange],
  )

  const {
    data: dashboardResponse,
    isLoading,
    fetchDashboard,
  } = useDashboard({
    id: dashboardData?.id,
    filters,
  })

  const { brands, cities, locations } = data || {
    brands: [],
    cities: [],
    locations: [],
  }

  // Función para generar y descargar el PDF usando la impresión nativa del navegador
  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true)

      // Mostrar instrucciones antes de imprimir
      toast.info('Preparando para imprimir', {
        description:
          "Se abrirá el diálogo de impresión. Selecciona 'Guardar como PDF' en el destino.",
        duration: 1500,
      })

      // Reducimos el retraso a la mitad para que la impresión sea más rápida
      setTimeout(() => {
        // Usar la función de impresión nativa del navegador
        window.print()

        // Restablecer el estado después de un breve retraso
        setIsGeneratingPdf(false)
      }, 1750)
    } catch (error) {
      console.error('Error al abrir el diálogo de impresión:', error)
      toast.error('Error al generar el PDF', {
        description: 'Ocurrió un problema al abrir el diálogo de impresión',
      })
      setIsGeneratingPdf(false)
    }
  }

  const brandOptions =
    brands?.map((brand: Brand) => ({
      value: brand.id,
      label: brand.name,
    })) || []

  const cityOptions =
    cities?.map((city: string) => ({
      value: city,
      label: city,
    })) || []

  const locationOptions =
    locations
      ?.filter(
        (location: Location) => !selectedCity || location.city === selectedCity,
      )
      .map((location: Location) => ({
        value: location.id,
        label: `${location.name} - ${location.address}`,
      })) || []

  const selectCity = (city: string) => {
    if (city === selectedCity) {
      setSelectedCity(undefined)
      setSelectedLocation(undefined)
    } else {
      setSelectedCity(city)
      setSelectedLocation(undefined)
    }
  }

  const selectLocation = (location: string) => {
    if (location === selectedLocation) {
      setSelectedLocation(undefined)
    } else {
      setSelectedLocation(location)
    }
  }

  useEffect(() => {
    if (dashboardResponse) {
      setDashboardData(dashboardResponse)
    }
  }, [dashboardResponse, setDashboardData])

  useEffect(() => {
    if (dashboardData !== null && !firstNonNullDashboardDataLoading) {
      setFirstNonNullDashboardDataLoading(true)
      const minDate = dashboardData.submissions.reduce((min, submission) => {
        return Math.min(min, new Date(submission.submittedAt).getTime())
      }, Infinity)
      if (minDate !== Infinity) {
        setDateRange({
          from: new Date(minDate),
          to: new Date(),
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardData])

  useEffect(() => {
    // Cuando cambien los filtros, activamos la carga del dashboard
    fetchDashboard()
  }, [fetchDashboard, filters])

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <DatePicker value={dateRange} onChange={setDateRange} />
      <MultiSelect
        options={brandOptions}
        selected={selectedBrands}
        onChange={setSelectedBrands}
        placeholder="Marca"
      />
      <SearchableSelect
        options={cityOptions}
        value={selectedCity}
        onChange={selectCity}
        placeholder="Ciudad"
        searchPlaceholder="Buscar ciudad..."
      />
      <SearchableSelect
        options={locationOptions}
        value={selectedLocation}
        onChange={selectLocation}
        placeholder="Punto de venta"
        searchPlaceholder="Buscar punto de venta..."
      />
      {!mobile && (
        <Button
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf || isLoading}
          variant="primary-outline"
          className="print:hidden"
        >
          <Download className="mr-2 h-4 w-4" />
          {isGeneratingPdf ? 'Procesando...' : 'Descargar'}
        </Button>
      )}
    </div>
  )
}
