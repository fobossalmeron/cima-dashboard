import { StoreTypePieChart } from "@/components/product/store-type-chart"
import { ProductLocationChart } from "@/components/product/product-location-chart"
import { ProductStatusChart } from "@/components/product/product-status-chart"
import { AveragePriceChart } from "@/components/product/average-price-chart"
import { ActivationsChart } from "@/components/product/activations-chart"
import { ProductImages } from "@/components/product/product-images"
import { Header } from "@/components/header"
import { Content } from "@/components/content"

export default function ProductInfo() {
  return (
    <div className="space-y-6">
      <Header title="Información del producto" />
      <Content>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

