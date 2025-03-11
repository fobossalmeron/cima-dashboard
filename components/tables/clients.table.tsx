"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import Link from "next/link";
import { ClientData } from "@/types/ClientData";

interface ClientsTableProps {
  clients: ClientData[];
}

export function ClientsTable({ clients }: ClientsTableProps) {
  return (
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
  );
} 