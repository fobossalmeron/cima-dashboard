import { PrismaClient, Prisma } from '@prisma/client'
import { neonConfig, Pool } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { isEdgeRuntime } from '@/lib/config/runtime'

// Configuración común de Prisma
const prismaConfig = {
  log: ['error', 'warn'] as const,
} satisfies Prisma.PrismaClientOptions

// Configuración de transacciones
const transactionConfig = {
  timeout: 30_000, // 30 segundos
  maxWait: 10_000, // 10 segundos
}

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
      return new PrismaClient(prismaConfig)
    }

    // En Edge Runtime, usar adaptador Neon
    if (typeof globalThis.WebSocket === 'undefined') {
      neonConfig.webSocketConstructor = globalThis.WebSocket
    }

    neonConfig.useSecureWebSocket = true as const
    neonConfig.pipelineTLS = true
    neonConfig.pipelineConnect = 'password'

    const connectionString = process.env.DATABASE_URL!
    connectionPool = new Pool({
      connectionString,
      connectionTimeoutMillis: 10_000,
    })
    const adapter = new PrismaNeon(connectionPool)

    return new PrismaClient({
      ...prismaConfig,
      // @ts-expect-error - El tipo adapter no está en los tipos públicos pero es válido
      adapter,
    })
  })()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Exportar el pool para limpieza solo si está definido
export { connectionPool }

// Función auxiliar para ejecutar transacciones con reintentos
export async function withTransaction<T>(
  fn: (tx: Prisma.TransactionClient) => Promise<T>,
  maxAttempts = 3,
): Promise<T> {
  let attempt = 0
  let lastError: Error | undefined

  while (attempt < maxAttempts) {
    try {
      return await prisma.$transaction(async (tx) => {
        return await fn(tx)
      }, transactionConfig)
    } catch (error) {
      lastError = error as Error
      attempt++

      // Si es un error de timeout o transacción cerrada, esperar antes de reintentar
      if (
        error instanceof Error &&
        (error.message.includes('Transaction already closed') ||
          error.message.includes('Transaction not found') ||
          error.message.includes('Transaction API error'))
      ) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
        continue
      }

      // Si es otro tipo de error, lanzarlo inmediatamente
      throw error
    }
  }

  throw lastError
}
