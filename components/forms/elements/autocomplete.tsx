import { Autocomplete } from '@/components/ui/autocomplete'
import { AutocompleteProps } from '@/components/ui/autocomplete/types'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useFormContext } from 'react-hook-form'

interface FormAutocompleteProps
  extends Omit<AutocompleteProps, 'onValueChange'> {
  label: string
  name: string
}

export function FormAutocomplete({
  label,
  name,
  searchConfig,
}: FormAutocompleteProps) {
  const form = useFormContext()
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Autocomplete
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Buscar formulario..."
                searchConfig={searchConfig}
                className="w-full"
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
