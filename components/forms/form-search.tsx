import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RepslyService } from '@/lib/services/repsly/repsly.service'
import { useToast } from '@/components/ui/use-toast'
import { ApiStatus } from '@/enums/api-status'

export function FormSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await RepslyService.searchForms(searchTerm)
      if (response.status === ApiStatus.SUCCESS) {
        // Aquí puedes manejar los resultados de la búsqueda
        console.log('Resultados:', response.data)
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Error al buscar formularios',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Error desconocido',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="searchTerm">Buscar Formularios</Label>
        <Input
          id="searchTerm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Ingresa un término de búsqueda"
          required
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Buscando...' : 'Buscar'}
      </Button>
    </form>
  )
}
