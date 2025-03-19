import { BrandWithSubBrandsAndProducts } from '@/types/api'
import Image from 'next/image'

interface ProductsTableProps {
  products: BrandWithSubBrandsAndProducts[]
}

export function ProductsTable({ products }: ProductsTableProps) {
  return (
    <div className="grid gap-6">
      {products.map((brand) => (
        <div
          key={brand.id}
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <h2 className="text-2xl font-semibold mb-4">{brand.name}</h2>
          <div className="grid gap-4">
            {brand.subBrands.map((subBrand) => (
              <div key={subBrand.id} className="border-t pt-4">
                <h3 className="text-xl font-medium mb-3">{subBrand.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subBrand.products.map((product) => (
                    <div key={product.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        {product.imageUrl && (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded"
                            width={80}
                            height={80}
                          />
                        )}
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-gray-600">
                            {product.presentation?.name}
                          </p>
                          {product.flavor && (
                            <p className="text-sm text-gray-600">
                              Sabor: {product.flavor.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
