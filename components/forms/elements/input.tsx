import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useFormContext } from 'react-hook-form'

interface FormInputProps {
  label: string
  description?: string
  name: string
  placeholder?: string
}

export function FormInput({
  label,
  name,
  description,
  placeholder,
}: FormInputProps) {
  const form = useFormContext()
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="gap-1">
          <FormLabel>{label}</FormLabel>
          {description && <FormDescription>{description}</FormDescription>}
          <FormControl>
            <Input placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
