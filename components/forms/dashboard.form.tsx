'use client'

import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { NewDashboardForm } from '@/types/dashboard'
import { FormTemplateSearchResponse } from '@/types/api/form-template-search-response'
import { ClientData } from '@/types/api'
import { FormSelect, FormAutocomplete, FormInput } from './elements'

const formSchema = z.object({
  clientId: z.string().min(1, 'Debes seleccionar un cliente'),
  formId: z.string().min(1, 'Debes seleccionar un formulario'),
  name: z.string().min(1, 'El nombre es requerido'),
})

interface DashboardFormProps {
  clients: ClientData[]
  onSubmit: (data: NewDashboardForm) => void
}

export function DashboardForm({ clients, onSubmit }: DashboardFormProps) {
  const form = useForm<NewDashboardForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: '',
      formId: '',
      name: '',
    },
  })

  const clientOptions = clients.map((client) => ({
    value: client.id.toString(),
    label: client.name,
  }))

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
        <FormSelect label="Cliente" name="clientId" options={clientOptions} />

        <FormAutocomplete
          label="Formulario"
          name="formId"
          searchConfig={formSearchConfig}
        />

        <FormInput label="Nombre" name="name" />

        <Button type="submit" className="w-full">
          Crear Dashboard
        </Button>
      </form>
    </Form>
  )
}
