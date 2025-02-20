import { StoreTypePieChart } from "@/components/product-info/store-type-chart"
import { ProductLocationChart } from "@/components/product-info/product-location-chart"
import { ProductStatusChart } from "@/components/product-info/product-status-chart"
import { AveragePriceChart } from "@/components/product-info/average-price-chart"
import { ActivationsChart } from "@/components/product-info/activations-chart"
import { ProductImages } from "@/components/product-info/product-images"
import { Header } from "@/components/header"
import { Content } from "@/components/content"

export default function ProductInfo() {
  return (
    <div className="space-y-6">
      <Header title="Información del Producto" />
      <Content>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StoreTypePieChart />
          <ProductLocationChart />
          <ProductStatusChart />
          <AveragePriceChart />
          <ActivationsChart />
          <ProductImages />
        </div>
      </Content>
    </div>
  )
}

