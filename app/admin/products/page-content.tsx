'use client'

import { useState, useEffect } from 'react'
import { BrandWithSubBrandsAndProducts } from '@/types/api'
import { toast } from 'sonner'
import { ProductsTable } from '@/components/tables/products.table'

export default function ProductsPageContent() {
  const [products, setProducts] = useState<BrandWithSubBrandsAndProducts[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProducts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/products')
      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setProducts(data.data)
    } catch (err) {
      setError('Error al cargar los productos')
      console.error('Error al cargar productos:', err)
      toast.error('Error al cargar los productos')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-medium">Productos</h1>
          <p className="text-sm text-muted-foreground">
            Visualiza todos los productos organizados por marca y submarca.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Cargando productos...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <ProductsTable products={products} />
      )}
    </div>
  )
}
