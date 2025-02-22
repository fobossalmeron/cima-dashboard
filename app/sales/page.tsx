"use client";

import { ProductSalesChart } from "@/components/product-sales/product-sales-chart";
import { Header } from "@/components/header";
import { Content } from "@/components/content";
import { products } from "@/data/brands";
import { TotalSalesByBrand } from "@/components/sales/total-sales-by-brand-chart";

export default function ProductSales() {
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
      <Header title="Ventas por producto" />
      <Content>
        <div className="w-full">
          <TotalSalesByBrand />
        </div>
        <h2 className="text-lg font-bold">Raptor Energy Drink</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <ProductSalesChart
              title="Raptor Energy Drink"
              data={raptorEnergyDrink}
            />
          </div>
        </div>

        <h2 className="text-lg font-bold lg:col-span-3 md:col-span-2">
          Del Frutal
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductSalesChart
            title="Del Frutal Néctar - Tetrapack 1L"
            data={delFrutalNectaresTetra}
          />
          <ProductSalesChart
            title="Del Frutal Néctar - Lata"
            data={delFrutalNectaresLata}
          />
          <ProductSalesChart
            title="Del Frutal Néctar - 3 Pack 200ml"
            data={delFrutalNectares3Pack}
          />
          <ProductSalesChart
            title="Del Frutal Aguas Frescas"
            data={delFrutalAguasFrescas}
          />
          <ProductSalesChart title="Del Frutal Pulpa" data={delFrutalPulpa} />
        </div>

        <h2 className="text-lg font-bold lg:col-span-3 md:col-span-2">
          Naturas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductSalesChart
            title="Naturas Néctar - Lata"
            data={naturasNectaresLata}
          />
          <ProductSalesChart
            title="Naturas Néctar - Tetrapack 1L"
            data={naturasNectaresTetra}
          />
          <ProductSalesChart
            title="Naturas Néctar - 3 Pack 200ml"
            data={naturasNectares3Pack}
          />
          <ProductSalesChart title="Naturas Pulpa" data={naturasPulpa} />
        </div>
      </Content>
    </div>
  );
}
