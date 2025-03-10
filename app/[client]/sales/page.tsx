"use client";

import { Header } from "@/components/header";
import { Content } from "@/components/content";
import { products } from "@/data/brands";
import { TotalSalesByBrand } from "@/components/sales/total-sales-by-brand-chart";
import { ProductSalesTable } from "@/components/sales/product-sales-table";
import { TotalSalesByBrandData } from "@/components/sales/sales.types";

const TotalSalesByBrandDummy: TotalSalesByBrandData[] = [
  { brand: "Del Frutal Aguas Frescas", quantity: 5100 },
  { brand: "Del Frutal Néctares", quantity: 2600 },
  { brand: "Del Frutal Pulpa", quantity: 4300 },
  { brand: "Raptor Energy Drink", quantity: 1000 },
  { brand: "Naturas Néctares", quantity: 1000 },
  { brand: "Naturas Pulpa", quantity: 1000 },
];

export default function Sales() {
  // Filtrar productos por marca y submarca
  const delFrutalNectares = products.filter(
    (product) =>
      product.brand === "Del Frutal" && product.subBrand === "Néctares"
  );

  const delFrutalAguasFrescas = products.filter(
    (product) =>
      product.brand === "Del Frutal" && product.subBrand === "Aguas Frescas"
  );

  // Añadir filtro para Del Frutal Pulpa
  const delFrutalPulpa = products.filter(
    (product) => product.brand === "Del Frutal" && product.subBrand === "Pulpa"
  );

  const raptorEnergyDrink = products.filter(
    (product) => product.brand === "Raptor Energy Drink"
  );

  const naturasNectares = products.filter(
    (product) => product.brand === "Naturas" && product.subBrand === "Néctares"
  );

  const naturasPulpa = products.filter(
    (product) => product.brand === "Naturas" && product.subBrand === "Pulpa"
  );

  // Del Frutal Néctares por empaque
  const delFrutalNectaresLata = delFrutalNectares.filter(
    (product) => product.presentation === "Lata"
  );
  const delFrutalNectaresTetra = delFrutalNectares.filter(
    (product) => product.presentation === "Tetrapack"
  );
  const delFrutalNectares3Pack = delFrutalNectares.filter(
    (product) => product.presentation === "3 Pack"
  );

  // Naturas Néctares por empaque
  const naturasNectaresLata = naturasNectares.filter(
    (product) => product.presentation === "Lata"
  );
  const naturasNectaresTetra = naturasNectares.filter(
    (product) => product.presentation === "Tetrapack"
  );
  const naturasNectares3Pack = naturasNectares.filter(
    (product) => product.presentation === "3 Pack"
  );

  return (
    <div className="space-y-6">
      <Header title="Ventas" />
      <Content>
        <div className="w-full">
          <TotalSalesByBrand data={TotalSalesByBrandDummy} />
        </div>
        <h2 className="text-lg font-bold">Raptor Energy Drink</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <ProductSalesTable
              title="Raptor Energy Drink"
              data={raptorEnergyDrink}
            />
          </div>
        </div>

        <h2 className="text-lg font-bold lg:col-span-3 md:col-span-2">
          Del Frutal
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductSalesTable
            title="Del Frutal Néctar - Tetrapack 1L"
            data={delFrutalNectaresTetra}
          />
          <ProductSalesTable
            title="Del Frutal Néctar - Lata"
            data={delFrutalNectaresLata}
          />
          <ProductSalesTable
            title="Del Frutal Néctar - 3 Pack 200ml"
            data={delFrutalNectares3Pack}
          />
          <ProductSalesTable
            title="Del Frutal Aguas Frescas"
            data={delFrutalAguasFrescas}
          />
          <ProductSalesTable title="Del Frutal Pulpa" data={delFrutalPulpa} />
        </div>

        <h2 className="text-lg font-bold lg:col-span-3 md:col-span-2">
          Naturas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductSalesTable
            title="Naturas Néctar - Lata"
            data={naturasNectaresLata}
          />
          <ProductSalesTable
            title="Naturas Néctar - Tetrapack 1L"
            data={naturasNectaresTetra}
          />
          <ProductSalesTable
            title="Naturas Néctar - 3 Pack 200ml"
            data={naturasNectares3Pack}
          />
          <ProductSalesTable title="Naturas Pulpa" data={naturasPulpa} />
        </div>
      </Content>
    </div>
  );
}
