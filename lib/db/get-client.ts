// NOTA: Esta es una implementación temporal. 
// TODO: Reemplazar con la implementación real de Prisma cuando esté lista
// TODO: Schema de Prisma necesario:
// model Client {
//   id        String   @id @default(cuid())
//   name      String
//   slug      String   @unique
//   formId    String   @unique
// }

import { ClientData } from "@/types/ClientData";
import { mockDashboards } from "@/data/dummy-dashboards";
/**
 * Verifica si un cliente existe en el sistema
 * @param clientId - Slug del cliente a verificar
 * @returns ClientData si existe, null si no existe
 */
export async function getClientData(clientId: string): Promise<ClientData | null> {
  // Normalizar el ID (minúsculas, sin espacios, etc.)
  const normalizedId = clientId.toLowerCase().trim();

  try {
    // NOTA: Esta implementación será reemplazada por Prisma con:
    // return await prisma.client.findUnique({ where: { slug: normalizedId } });

    // Buscar el cliente cuyo slug coincida con el normalizedId
    const client = mockDashboards.find(client => client.slug === normalizedId) || null;

    return client;
  } catch (error) {
    console.error("Error al verificar cliente:", error);
    return null;
  }
}