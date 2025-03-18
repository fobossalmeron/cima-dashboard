import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RepslyService } from '@/lib/services'
import { useToast } from '@/components/ui/use-toast'
import { ApiStatus } from '@/enums/api-status'

export function SyncForm() {
  const [formId, setFormId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await RepslyService.syncDashboard(formId)
      if (response.status === ApiStatus.SUCCESS) {
        toast({
          title: 'Sincronización exitosa',
          description: 'Los datos se han sincronizado correctamente.',
        })
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Error al sincronizar los datos',
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
        <Label htmlFor="formId">ID del Formulario</Label>
        <Input
          id="formId"
          value={formId}
          onChange={(e) => setFormId(e.target.value)}
          placeholder="Ingresa el ID del formulario"
          required
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Sincronizando...' : 'Sincronizar'}
      </Button>
    </form>
  )
}
