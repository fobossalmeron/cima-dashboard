import { PrismaClient } from '@prisma/client'
import { neonConfig, Pool } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { isEdgeRuntime } from '@/lib/config/runtime'

// Crear cliente de Prisma con el adaptador en producción
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Variable para almacenar el pool de conexiones
let connectionPool: Pool | undefined

export const prisma =
  globalForPrisma.prisma ??
  (() => {
    // Si no estamos en Edge Runtime, usar conexión directa
    if (!isEdgeRuntime()) {
      return new PrismaClient()
    }

    // En Edge Runtime, usar adaptador Neon
    if (typeof globalThis.WebSocket === 'undefined') {
      neonConfig.webSocketConstructor = globalThis.WebSocket
    }

    neonConfig.useSecureWebSocket = true as const
    neonConfig.pipelineTLS = true
    neonConfig.pipelineConnect = 'password'

    const connectionString = process.env.DATABASE_URL!
    connectionPool = new Pool({ connectionString })
    const adapter = new PrismaNeon(connectionPool)

    return new PrismaClient({
      // @ts-expect-error - El tipo adapter no está en los tipos públicos pero es válido
      adapter,
    })
  })()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Exportar el pool para limpieza solo si está definido
export { connectionPool }
