import { DashboardData } from '@/types/DashboardData'
import { prisma } from '@/lib/prisma'

/**
 * Obtiene los datos del dashboard
 * @returns DashboardData con productos, precios y ventas
 */
export async function getDashboardData(formId: string): Promise<DashboardData> {
  try {
    // Obtener las métricas de productos para el form template
    const productMetrics = await prisma.productMetrics.findMany({
      where: {
        formId: formId,
      },
      include: {
        product: {
          include: {
            brand: true,
            subBrand: true,
            presentation: true,
            flavor: true,
          },
        },
      },
    })

    // Transformar los datos al formato esperado
    const dashboardData: DashboardData = {}

    for (const metric of productMetrics) {
      const product = metric.product
      const productKey = `${product.brand.name}_${
        product.subBrand?.name || ''
      }_${product.presentation?.name || ''}_${
        product.flavor?.name || ''
      }`.replace(/\s+/g, '_')

      dashboardData[productKey] = {
        id: product.id,
        name: product.name,
        price: metric.price,
        sales: metric.sales,
      }
    }

    return dashboardData
  } catch (error) {
    console.error('Error al obtener datos del dashboard:', error)
    throw error
  }
}
