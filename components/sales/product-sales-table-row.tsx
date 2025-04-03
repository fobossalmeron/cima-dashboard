import Image from 'next/image'
import { TableCell, TableRow } from '../ui/table'
import { ProductSaleWithRelations } from '@/types/api/clients'
import { getProductImage } from '@/lib/utils/dashboard-data/sales'

export function ProductSalesTableRow({
  item,
}: {
  item: ProductSaleWithRelations
}) {
  const image = getProductImage(item.product)
  const numberFormatter = new Intl.NumberFormat('es-MX')
  const productName = () => {
    const flavorName = item.product.flavor?.name
      .replace('Not specified', '')
      .trim()
    const presentationName = item.product.presentation?.name
      .replace('Not specified', '')
      .trim()
    if (flavorName?.length || presentationName?.length) {
      return `${flavorName} ${presentationName}`.trim()
    }
    return 'Producto único'
  }
  return (
    <TableRow key={item.id}>
      <TableCell className="flex items-center gap-4">
        {image && (
          <Image
            src={image}
            alt={item.product.flavor?.name ?? ''}
            width={22}
            height={22}
            className="object-cover"
          />
        )}
        {productName()}
      </TableCell>
      <TableCell className="text-end">
        {numberFormatter.format(item.quantity)}
      </TableCell>
    </TableRow>
  )
}
