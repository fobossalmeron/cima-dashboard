"use client";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datepicker";
import { Download } from "lucide-react";
import { MultiSelect } from "@/components/ui/multi-select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import React from "react";
import { toast } from "sonner";

export function Filters({
  className,
  mobile,
}: {
  className?: string;
  mobile?: boolean;
}) {
  const [selectedBrands, setSelectedBrands] = React.useState<string[]>([]);
  const [selectedCity, setSelectedCity] = React.useState<string>();
  const [selectedLocation, setSelectedLocation] = React.useState<string>();
  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);

  const brandOptions = [
    { value: "raptor", label: "Raptor" },
    { value: "del-frutal", label: "Del Frutal" },
    { value: "naturas", label: "Naturas" },
  ];

  const cityOptions = [
    { value: "stamford", label: "Stamford, CT" },
    { value: "bridgeport", label: "Bridgeport, CT" },
    { value: "new-haven", label: "New Haven, CT" },
  ];

  const directionOptions = [
    {
      value: "new-haven-1",
      label: "New Haven Grocery - 240 NE 8th St, New Haven, FL 33030",
    },
    {
      value: "stamford-1",
      label: "Stamford Market - 1 Atlantic St, Stamford, CT 06901",
    },
    {
      value: "bridgeport-1",
      label: "Bridgeport Superstore - 500 Broad St, Bridgeport, CT 06604",
    },
    {
      value: "new-haven-2",
      label: "New Haven Deli - 900 Chapel St, New Haven, CT 06510",
    },
    {
      value: "stamford-2",
      label: "Stamford Groceries - 300 Tresser Blvd, Stamford, CT 06901",
    },
  ];

  // Asegurarse de que las opciones nunca sean undefined
  const safeDirectionOptions = selectedCity
    ? directionOptions.filter((option) => option.value.startsWith(selectedCity))
    : directionOptions;

  // Función para generar y descargar el PDF usando la impresión nativa del navegador
  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);

      // Mostrar instrucciones antes de imprimir
      toast.info("Preparando para imprimir", {
        description:
          "Se abrirá el diálogo de impresión. Selecciona 'Guardar como PDF' en el destino.",
        duration: 1500,
      });

      // Reducimos el retraso a la mitad para que la impresión sea más rápida
      setTimeout(() => {
        // Usar la función de impresión nativa del navegador
        window.print();

        // Restablecer el estado después de un breve retraso

        setIsGeneratingPdf(false);
      }, 1750);
    } catch (error) {
      console.error("Error al abrir el diálogo de impresión:", error);
      toast.error("Error al generar el PDF", {
        description: "Ocurrió un problema al abrir el diálogo de impresión",
      });
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <DatePicker />
      <MultiSelect
        options={brandOptions}
        selected={selectedBrands}
        onChange={setSelectedBrands}
        placeholder="Marca"
      />
      <SearchableSelect
        options={cityOptions || []}
        value={selectedCity}
        onChange={setSelectedCity}
        placeholder="Ciudad"
        searchPlaceholder="Buscar ciudad..."
      />
      <SearchableSelect
        options={safeDirectionOptions || []}
        value={selectedLocation}
        onChange={setSelectedLocation}
        placeholder="Punto de venta"
        searchPlaceholder="Buscar punto de venta..."
      />
      {!mobile && (
        <Button
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          variant="primary-outline"
          className="print:hidden"
        >
          <Download className="mr-2 h-4 w-4" />
          {isGeneratingPdf ? "Procesando..." : "Descargar"}
        </Button>
      )}
    </div>
  );
}
