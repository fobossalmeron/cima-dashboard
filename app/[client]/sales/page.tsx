'use client'

import { Header } from '@/components/header'
import { Content } from '@/components/content'
import { products } from '@/data/brands'
import { TotalSalesByBrand } from '@/components/sales/total-sales-by-brand-chart'
import { ProductSalesChart } from '@/components/sales/product-sales-chart'

export default function Sales() {
  // Filtrar productos por marca y submarca
  const delFrutalNectares = products.filter(
    (product) =>
      product.brand === 'Del Frutal' && product.subBrand === 'Néctares',
  )

  const delFrutalAguasFrescas = products.filter(
    (product) =>
      product.brand === 'Del Frutal' && product.subBrand === 'Aguas Frescas',
  )

  // Añadir filtro para Del Frutal Pulpa
  const delFrutalPulpa = products.filter(
    (product) => product.brand === 'Del Frutal' && product.subBrand === 'Pulpa',
  )

  const raptorEnergyDrink = products.filter(
    (product) => product.brand === 'Raptor Energy Drink',
  )

  const naturasNectares = products.filter(
    (product) => product.brand === 'Naturas' && product.subBrand === 'Néctares',
  )

  const naturasPulpa = products.filter(
    (product) => product.brand === 'Naturas' && product.subBrand === 'Pulpa',
  )

  // Del Frutal Néctares por empaque
  const delFrutalNectaresLata = delFrutalNectares.filter(
    (product) => product.presentation === 'Lata',
  )
  const delFrutalNectaresTetra = delFrutalNectares.filter(
    (product) => product.presentation === 'Tetrapack',
  )
  const delFrutalNectares3Pack = delFrutalNectares.filter(
    (product) => product.presentation === '3 Pack',
  )

  // Naturas Néctares por empaque
  const naturasNectaresLata = naturasNectares.filter(
    (product) => product.presentation === 'Lata',
  )
  const naturasNectaresTetra = naturasNectares.filter(
    (product) => product.presentation === 'Tetrapack',
  )
  const naturasNectares3Pack = naturasNectares.filter(
    (product) => product.presentation === '3 Pack',
  )

  return (
    <div className="space-y-6">
      <Header title="Ventas" />
      <Content>
        <div className="w-full">
          <TotalSalesByBrand />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 print:grid-cols-3 gap-6">
          {Object.entries(groupedProducts).flatMap(([brand, subBrands]) =>
            Object.entries(subBrands).map(([subBrand, products]) => (
              <ProductSalesTable
                key={`${brand}-${subBrand}`}
                title={subBrand}
                data={products}
              />
            )),
          )}
        </div>
      </Content>
    </div>
  )
}
