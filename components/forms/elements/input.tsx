import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useFormContext } from 'react-hook-form'

interface FormInputProps {
  label: string
  name: string
}

export function FormInput({ label, name }: FormInputProps) {
  const form = useFormContext()
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder="Ingresa el nombre del dashboard" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
