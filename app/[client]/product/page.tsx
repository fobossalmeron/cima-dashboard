import { PDVTypeChart } from "@/components/product/pdv-type-chart";
import { ProductLocationInPDVChart } from "@/components/product/product-location-in-pdv-chart";
import { ProductStatusInPDVChart } from "@/components/product/product-status-in-pdv-chart";
import { AveragePriceInPDVChart } from "@/components/product/average-price-in-pdv-chart";
import { OldAndNewActivationsChart } from "@/components/product/old-and-new-activations-chart";
import { PDVProductImages } from "@/components/product/pdv-product-images";
import { Header } from "@/components/header";
import { Content } from "@/components/content";
import {
  ProductStatusInPDVChartData,
  ProductLocationInPDVChartData,
  PDVTypeChartData,
  PDVProductImagesData,
  OldAndNewActivationsChartData,
  AveragePriceInPDVChartData,
} from "@/components/product/product.types";

const PDVTypeChartDummy: PDVTypeChartData[] = [
  { type: "Supermarket", quantity: 25 },
  { type: "Midmarket", quantity: 14 },
  { type: "Downtrade", quantity: 101 },
  { type: "Convenience", quantity: 12 },
];

const ProductLocationInPVDChartDummy: ProductLocationInPDVChartData[] = [
  { location: "Estantes", quantity: 43 },
  { location: "Neveras", quantity: 37 },
  { location: "Display Marca", quantity: 120 },
  { location: "Display Tienda", quantity: 10 },
];

const ProductStatusInPDVChartDummy: ProductStatusInPDVChartData[] = [
  { type: "En promoción", quantity: 100 },
  { type: "Precio regular", quantity: 40 },
];

const AveragePriceInPDVChartDummy: AveragePriceInPDVChartData[] = [
  { brand: "Del Frutal Aguas Frescas", averagePrice: 1.99 },
  { brand: "Del Frutal Pulpa 1L", averagePrice: 2.99 },
  { brand: "Del Frutal Lata", averagePrice: 2.79 },
  { brand: "Del Frutal Tetrapack", averagePrice: 2.79 },
  { brand: "Del Frutal 3 Pack", averagePrice: 2.79 },
  { brand: "Raptor Lata", averagePrice: 0.99 },
  { brand: "Raptor Botella", averagePrice: 1.49 },
  { brand: "Naturas Lata", averagePrice: 2.59 },
  { brand: "Naturas Tetrapack", averagePrice: 2.59 },
  { brand: "Naturas 3 Pack", averagePrice: 2.59 },
  { brand: "Naturas Pulpa 1L", averagePrice: 2.59 },
];

const OldAndNewActivationsChartDummy: OldAndNewActivationsChartData[] = [
  {
    month: "Enero",
    new_location_activations: 45,
    previous_location_activations: 30,
    new_locations: 15,
    previous_locations: 10,
  },
  {
    month: "Febrero",
    new_location_activations: 60,
    previous_location_activations: 40,
    new_locations: 20,
    previous_locations: 15,
  },
  {
    month: "Marzo",
    new_location_activations: 95,
    previous_location_activations: 50,
    new_locations: 45,
    previous_locations: 20,
  },
  {
    month: "Abril",
    new_location_activations: 90,
    previous_location_activations: 60,
    new_locations: 30,
    previous_locations: 25,
  },
  {
    month: "Mayo",
    new_location_activations: 55,
    previous_location_activations: 70,
    new_locations: 15,
    previous_locations: 30,
  },
  {
    month: "Junio",
    new_location_activations: 120,
    previous_location_activations: 80,
    new_locations: 20,
    previous_locations: 35,
  },
];

const PDVProductImagesDummy: PDVProductImagesData[] = [
  {
    locationName: "Food Star",
    address: "5521 Leesburg Pike, 22041, Bailey's Crossroads, Virginia",
    url: "/assets/dummy/pdv1.jpg",
  },
  {
    locationName: "Stamford Market",
    address: "123 Broad St, 06901, Stamford, Connecticut",
    url: "/assets/dummy/pdv2.jpg",
  },
  {
    locationName: "Greenwich Grocer",
    address: "456 E Putnam Ave, 06830, Greenwich, Connecticut",
    url: "/assets/dummy/pdv3.jpg",
  },
  {
    locationName: "Norwalk Mart",
    address: "789 Main Ave, 06851, Norwalk, Connecticut",
    url: "/assets/dummy/pdv4.jpg",
  },
  {
    locationName: "Stamford Market",
    address: "123 Broad St, 06901, Stamford, Connecticut",
    url: "/assets/dummy/pdv5.jpg",
  },
];

export default function ProductInfo() {
  return (
    <div className="space-y-6">
      <Header title="Información del producto" />
      <Content>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PDVTypeChart data={PDVTypeChartDummy} />
          <ProductLocationInPDVChart data={ProductLocationInPVDChartDummy} />
          <ProductStatusInPDVChart data={ProductStatusInPDVChartDummy} />
          <AveragePriceInPDVChart data={AveragePriceInPDVChartDummy} />
          <OldAndNewActivationsChart data={OldAndNewActivationsChartDummy} />
          <PDVProductImages data={PDVProductImagesDummy} />
        </div>
      </Content>
    </div>
  );
}
