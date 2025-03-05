"use client";

import { Header } from "@/components/header";
import { Content } from "@/components/content";
import { ActivationSalesChart } from "@/components/general/activation-sales-chart";
import { Maps } from "@/components/general/maps/maps";
import { Kpis } from "@/components/general/kpis";
import {
  KpisData,
  ActivationSalesChartData,
  MapsData,
} from "@/components/general/general.types";

const MapsDataDummy: MapsData = {
  citiesData: [
    {
      name: "Philadelphia",
      lat: 39.952583,
      lng: -75.165222,
      activations: 30,
      averageSales: 1800,
      totalStores: 2,
    },
    {
      name: "Stamford",
      lat: 41.05343,
      lng: -73.538734,
      activations: 15,
      averageSales: 1050,
      totalStores: 1,
    },
    {
      name: "New York",
      lat: 40.712776,
      lng: -74.005974,
      activations: 45,
      averageSales: 2500,
      totalStores: 3,
    },
    {
      name: "New Haven",
      lat: 41.308274,
      lng: -72.927884,
      activations: 12,
      averageSales: 780,
      totalStores: 1,
    },
    {
      name: "Bridgeport",
      lat: 41.18655,
      lng: -73.195176,
      activations: 25,
      averageSales: 1120,
      totalStores: 2,
    },
    {
      name: "Danbury",
      lat: 41.394817,
      lng: -73.454011,
      activations: 17,
      averageSales: 950,
      totalStores: 1,
    },
  ],
  storesData: [
    {
      name: "Hartford Market",
      address: "123 Main St, Hartford, CT 06101",
      city: "Hartford",
      state: "Connecticut",
      lat: 41.763711,
      lng: -72.685093,
      activations: 4,
      averageSales: 150,
    },
    {
      name: "New Haven Grocery",
      address: "456 Elm St, New Haven, CT 06511",
      city: "New Haven",
      state: "Connecticut",
      lat: 41.308274,
      lng: -72.927884,
      activations: 2,
      averageSales: 200,
    },
    {
      name: "Stamford Superstore",
      address: "789 Oak Ave, Stamford, CT 06902",
      city: "Stamford",
      state: "Connecticut",
      lat: 41.05343,
      lng: -73.538734,
      activations: 1,
      averageSales: 175,
    },
    {
      name: "Bridgeport Food Center",
      address: "101 Pine St, Bridgeport, CT 06604",
      city: "Bridgeport",
      state: "Connecticut",
      lat: 41.186548,
      lng: -73.195177,
      activations: 4,
      averageSales: 120,
    },
    {
      name: "Norwalk Market",
      address: "101 Pine St, Bridgeport, CT 06604",
      city: "Norwalk",
      state: "Connecticut",
      lat: 41.117744,
      lng: -73.408157,
      activations: 1,
      averageSales: 90,
    },
  ],
};

const KpisDummy: KpisData = {
  activations: 112,
  locationsVisited: 85,
  samplesDelivered: 5000,
  unitsSold: 2500,
  conversion: 90,
  velocity: 10.5,
  nps: 62,
  followings: 32,
};

const ActivationSalesChartDummy: ActivationSalesChartData[] = [
  { month: "Enero", activations: 34, totalSales: 6596, averageSales: 194 },
  { month: "Febrero", activations: 27, totalSales: 9657, averageSales: 631 },
  { month: "Marzo", activations: 15, totalSales: 5200, averageSales: 608 },
  { month: "Abril", activations: 37, totalSales: 8732, averageSales: 236 },
  { month: "Mayo", activations: 29, totalSales: 4089, averageSales: 141 },
  { month: "Junio", activations: 27, totalSales: 5211, averageSales: 193 },
];

export default function ClientDashboard() {
  return (
    <div>
      <Header title={"KPIs Generales"} />
      <Content>
        <div className="w-full grid grid-cols-1 lg:grid-cols-[67%_31%] gap-8">
          <Maps data={MapsDataDummy} />
          <Kpis data={KpisDummy} />
          <div className="col-span-1 lg:col-span-2">
            <ActivationSalesChart data={ActivationSalesChartDummy} />
          </div>
        </div>
      </Content>
    </div>
  );
}
