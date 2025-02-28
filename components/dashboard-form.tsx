'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock de formularios disponibles (esto vendría de una API real después)
const availableForms = [
  { id: 'FORM_123', name: 'Formulario EDT' },
  { id: 'FORM_456', name: 'Formulario General' },
  { id: 'FORM_789', name: 'Formulario Satisfacción' },
]

interface DashboardFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>
  newClient: {
    name: string
    slug: string
    formId: string
  }
  setNewClient: React.Dispatch<React.SetStateAction<{
    name: string
    slug: string
    formId: string
  }>>
}

export function DashboardForm({ onSubmit, newClient, setNewClient }: DashboardFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 mt-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Nombre del cliente
        </label>
        <Input
          type="text"
          value={newClient.name}
          onChange={(e) => setNewClient({...newClient, name: e.target.value})}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Url del dashboard (sin espacios ni caracteres especiales)
        </label>
        <Input
          type="text"
          value={newClient.slug}
          onChange={(e) => setNewClient({...newClient, slug: e.target.value})}
          required
          pattern="[a-z0-9-]+"
          title="Solo letras minúsculas, números y guiones"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Formulario
        </label>
        <Select 
          value={newClient.formId} 
          onValueChange={(value) => setNewClient({...newClient, formId: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un formulario" />
          </SelectTrigger>
          <SelectContent>
            {availableForms.map((form) => (
              <SelectItem key={form.id} value={form.id}>
                {form.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">
        Crear dashboard
      </Button>
    </form>
  )
} 