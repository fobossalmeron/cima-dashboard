'use client'

import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { NewDashboardForm } from '@/types/dashboard'
import { FormTemplateSearchResponse } from '@/types/api/form-template-search-response'
import { FormAutocomplete, FormInput } from './elements'

const formSchema = z.object({
  clientName: z.string().min(1, 'El nombre del cliente es requerido'),
  clientSlug: z
    .string()
    .min(1, 'El slug del cliente es requerido')
    .regex(
      /^[a-z0-9-]+$/,
      'El slug solo puede contener letras minúsculas, números y guiones',
    ),
  templateId: z.string().min(1, 'Debes seleccionar un formulario'),
})

interface DashboardFormProps {
  onSubmit: (data: NewDashboardForm) => void
  loading: boolean
}

export function DashboardForm({ onSubmit, loading }: DashboardFormProps) {
  const form = useForm<NewDashboardForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: '',
      clientSlug: '',
      templateId: '',
    },
  })

  const formSearchConfig = {
    url: '/api/repsly/forms',
    method: 'POST' as const,
    transformRequest: (searchTerm: string) => ({
      search: searchTerm,
    }),
    transformResponse: (data: {
      data: { items: FormTemplateSearchResponse[] }
    }) => {
      return data.data.items.map((form) => ({
        value: form.id,
        label: form.name,
      }))
    },
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput label="Nombre del Cliente" name="clientName" />
        <FormInput
          label="URL del dashboard"
          description="(Sin espacios ni caracteres especiales)"
          name="clientSlug"
        />
        <FormAutocomplete
          label="Formulario"
          name="templateId"
          searchConfig={formSearchConfig}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Dashboard'}
        </Button>
      </form>
    </Form>
  )
}
