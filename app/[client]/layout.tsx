import { ReactNode } from "react";
import { getClientData } from "@/lib/db/get-client";
import { getDashboardData } from "@/lib/db/get-dashboard";
import { ClientProvider } from "@/lib/context/ClientContext";
import { notFound } from "next/navigation";

export default async function ClientLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { client: string };
}) {
  const resolvedParams = await params;
  const clientData = await getClientData(resolvedParams.client);

  if (!clientData) {
    notFound();
    return null;
  }

  const dashboardData = await getDashboardData(clientData.formId);

  return (
    <ClientProvider clientData={clientData} dashboardData={dashboardData}>
      {children}
    </ClientProvider>
  );
}
