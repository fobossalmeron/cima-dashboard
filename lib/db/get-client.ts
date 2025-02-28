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

// Datos de clientes de ejemplo (temporal)
const mockClients = {
  "edt-drinks": {
    id: "cl_01",
    name: "EDT Bebidas",
    slug: "edt-drinks",
    formId: "FORM_123",
  },
  "cliente2": {
    id: "cl_02",
    name: "Cliente2",
    slug: "cliente2",
    formId: "FORM_456",
  }
};

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
      const client = mockClients[normalizedId as keyof typeof mockClients] || null;
      
      return client;
    } catch (error) {
      console.error("Error al verificar cliente:", error);
      return null;
    }
  }