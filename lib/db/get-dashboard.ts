import { DashboardData } from "@/types/DashboardData";

// Datos de dashboard de ejemplo (temporal)
const mockDashboard = {
  activation1: {
    id: "prod_01",
    name: "Producto 1",
    price: 100,
    sales: 50,
  },
  activation2: {
    id: "prod_02",
    name: "Producto 2",
    price: 200,
    sales: 30,
  }
};

/**
 * Obtiene los datos del dashboard
 * @returns DashboardData con productos, precios y ventas
 */
export async function getDashboardData(formID: string): Promise<DashboardData> {
  try {
    // NOTA: Esta implementación será reemplazada por Prisma con:
    // return await prisma.dashboard.findMany();
    console.log("formID", formID);
    return mockDashboard;
  } catch (error) {
    console.error("Error al obtener datos del dashboard:", error);
    throw error;
  }
} 