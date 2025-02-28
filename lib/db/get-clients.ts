import { ClientData } from "@/types/ClientData";

// Usando los mismos datos mock que en get-client.ts
// TODO: Reemplazar con la implementación real de Prisma cuando esté lista
import { mockDashboards } from "@/data/dummy-dashboards";

/**
 * Obtiene todos los clientes del sistema
 * @returns Promise<ClientData[]> Array con todos los clientes
 */
export async function getClients(): Promise<ClientData[]> {
  try {
    // NOTA: Esta implementación será reemplazada por Prisma con:
    // return await prisma.client.findMany();
    return Object.values(mockDashboards);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    return [];
  }
} 