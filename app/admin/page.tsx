"use client";

import { useState, useEffect } from "react";
import { ClientData } from "@/types/ClientData";
import Link from "next/link";
import { getClients } from "@/lib/db/get-clients";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DashboardForm } from "@/components/dashboard-form";
import { RefreshCcw } from "lucide-react";
// import CimaLogo from "@/public/cima.png";
import CimaSVG from "@/public/cima.svg";
import Image from "next/image";
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export default function AdminPage() {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    slug: "",
    formId: "",
  });

  useEffect(() => {
    const loadClients = async () => {
      try {
        setIsLoading(true);
        const data = await getClients();
        setClients(data);
      } catch (err) {
        setError("Error al cargar los clientes");
        console.error("Error al cargar clientes:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para crear un nuevo dashboard
    alert("Dashboard creado! (simulación)");
    setIsDialogOpen(false);
    setNewClient({ name: "", slug: "", formId: "" }); // Reset form
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Cargando clientes...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      );
    }

    return (
      <>
        {/* Lista de Dashboards Existentes */}
        <div className="mb-12">
          <div className="grid gap-4">
            {clients.map((client) => (
              <Card key={client.id}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{client.name}</h3>
                    <p className="text-sm text-gray-600">
                      Form: {client.formId}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="primary-outline">
                      <div>
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        <Link href={`/${client.slug}`}>Resync</Link>
                      </div>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href={`/${client.slug}`}>Ir a dashboard</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </>
    );
  };

  return (
    <div>
      <header className="flex w-full items-center border-b bg-background">
        <div className="flex w-full items-center justify-between gap-2 px-6 py-4">
          <Image src={CimaSVG} alt="Cima Logo" width={80} height={100} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:bg-transparent hover:text-foreground"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={() => {
                  window.location.href = "/login";
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-medium">
              Administrador de dashboards
            </h1>
            <p className="text-sm text-muted-foreground">
              Crea nuevos dashboards. Sincroniza si editaste un form submission
              recientemente.
            </p>
          </div>
          <div className="flex justify-between items-center mb-8">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nuevo dashboard
                </Button>
              </DialogTrigger>
              <DialogContent className="!max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Crear nuevo dashboard</DialogTitle>
                </DialogHeader>
                <DashboardForm
                  onSubmit={handleSubmit}
                  newClient={newClient}
                  setNewClient={setNewClient}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}
