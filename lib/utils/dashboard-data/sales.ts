import { TotalSalesByBrandData } from '@/components/sales/sales.types'
import { getPresentationName } from '@/lib/constants/regex'
import {
  DashboardWithRelations,
  ProductSaleWithRelations,
  ProductWithRelations,
} from '@/types/api/clients'

export function salesBySubBrand(
  dashboard: DashboardWithRelations,
): TotalSalesByBrandData[] {
  const subBrands = dashboard.submissions.reduce(
    (acc: { [key: string]: { quantity: number } }, submission) => {
      submission.productSales.forEach((sale) => {
        const subBrandFiltered = sale.product.subBrand?.name.replace(
          'Not specified',
          '',
        )
        const subBrandName = `${sale.product.brand.name} ${subBrandFiltered}`
        if (!acc[subBrandName]) {
          acc[subBrandName] = { quantity: 0 }
        }
        acc[subBrandName].quantity += sale.quantity
      })
      return acc
    },
    {},
  )

  return Object.entries(subBrands)
    .map(([subBrand, data]) => ({
      brand: subBrand,
      quantity: data.quantity,
    }))
    .sort((a, b) => b.quantity - a.quantity)
}

type ProductsByBrand = {
  [key: string]: {
    [key: string]: ProductSaleWithRelations[]
  }
}

function getSubBrandKey(sale: ProductSaleWithRelations) {
  const subBrandName = sale.product.subBrand?.name
  const presentationName = getPresentationName(sale.product.presentation?.name)
  if (subBrandName && presentationName) {
    return `${subBrandName}, ${presentationName}`
  } else if (subBrandName) {
    return subBrandName
  } else if (presentationName) {
    return presentationName
  }
  return 'Not specified'
}

export function groupedProductsByBrand(dashboard: DashboardWithRelations) {
  const result = dashboard.submissions.reduce<ProductsByBrand>(
    (acc: ProductsByBrand, submission) => {
      // Ordenar productSales antes de procesarlos para asegurar consistencia
      const sortedSales = [...submission.productSales].sort((a, b) =>
        a.product.id.localeCompare(b.product.id),
      )

      sortedSales.forEach((sale) => {
        const brand = sale.product.brand.name
        const subBrand = getSubBrandKey(sale)

        if (!acc[brand]) {
          acc[brand] = {}
        }
        if (!acc[brand][subBrand]) {
          acc[brand][subBrand] = []
        }

        // Buscar si ya existe un producto idéntico
        const existingProductIndex = acc[brand][subBrand].findIndex(
          (existingSale) =>
            existingSale.product.id === sale.product.id &&
            existingSale.product.flavor?.id === sale.product.flavor?.id &&
            existingSale.product.presentation?.id ===
              sale.product.presentation?.id,
        )

        if (existingProductIndex !== -1) {
          // Si existe, sumar la cantidad
          acc[brand][subBrand][existingProductIndex].quantity += sale.quantity
        } else {
          // Si no existe, agregar nuevo
          acc[brand][subBrand].push({
            ...sale,
            quantity: sale.quantity,
          })
        }
      })
      return acc
    },
    {},
  )

  // Ordenar los productos por cantidad en cada subBrand
  Object.keys(result).forEach((brand) => {
    Object.keys(result[brand]).forEach((subBrand) => {
      result[brand][subBrand].sort((a, b) => b.quantity - a.quantity)
    })
  })

  return result
}

export function getProductImage(product: ProductWithRelations) {
  if (product.imageUrl) {
    return product.imageUrl
  }
  const presentationName = product.presentation?.name
  if (presentationName?.includes('CAN')) {
    return `/assets/products/placeholder-lata.png`
  } else if (presentationName?.includes('PET')) {
    return `/assets/products/placeholder-botella.png`
  } else if (presentationName?.includes('3Pack')) {
    return `/assets/products/placeholder-3pack.png`
  } else if (presentationName?.includes('TETRAPACK')) {
    return `/assets/products/placeholder-tetrapack.png`
  }
  return `/assets/products/placeholder-botella.png`
}
