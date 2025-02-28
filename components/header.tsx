"use client";

import { Nav } from "@/components/nav";
import { Filters } from "@/components/filters";
import { Separator } from "@/components/ui/separator";
import CimaLogo from "@/public/cima.png";
import Image from "next/image";
import { MobileNav } from "@/components/mobile-nav";
import { MobileFilters } from "@/components/mobile-filters";
import { useClient } from "@/lib/context/ClientContext";

export const Header = ({ title }: { title: string }) => {
  const { clientData } = useClient();

  return (
    <div className="flex flex-col justify-between items-start w-full gap-8">
      <header className="flex w-full items-center border-b bg-background">
        <div className="flex w-full items-center justify-between gap-2 px-6 py-4">
          <Image src={CimaLogo} alt="Cima Logo" width={80} height={100} />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="text-xl font-medium">Tablero de {clientData.name}</div>
        </div>
      </header>
      <div className="w-full flex items-center gap-2 justify-between px-6">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <div className="container lg:hidden w-auto">
          <MobileNav clientName={clientData.slug} />
        </div>
        <nav className="hidden lg:flex">
          <Nav clientName={clientData.slug} />
        </nav>
      </div>
      <div className="w-full flex items-center gap-2 justify-between px-6">
        <div className="container lg:hidden w-auto">
          <MobileFilters />
        </div>
        <div className="hidden lg:block w-full">
          <Filters />
        </div>
      </div>
    </div>
  );
};
