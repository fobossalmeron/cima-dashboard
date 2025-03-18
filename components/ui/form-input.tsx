import { Input } from '@/components/ui/input'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Path, useFormContext } from 'react-hook-form'

interface FormInputProps<T extends Record<string, unknown>> {
  name: Path<T>
  label: string
  type?: string
  placeholder?: string
}

export function FormInput<T extends Record<string, unknown>>({
  name,
  label,
  type = 'text',
  placeholder,
}: FormInputProps<T>) {
  const form = useFormContext<T>()

  if (!form) {
    throw new Error('FormInput must be used within a FormProvider')
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              value={field.value as string}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
