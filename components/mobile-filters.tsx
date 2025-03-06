"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { Filters } from "@/components/filters";

export function MobileFilters() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="default" className="lg:hidden">
          <SlidersHorizontal className="h-5 w-5" />
          Filtros
          <span className="sr-only">Abrir filtros</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[300px] items-start justify-start px-6"
      >
        <SheetHeader className="px-0">
          <SheetTitle>Filtros</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <Filters className="flex-col items-start justify-start" mobile />
        </div>
      </SheetContent>
    </Sheet>
  );
}
