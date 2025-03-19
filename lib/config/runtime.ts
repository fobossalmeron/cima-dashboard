// Configuración estática para el runtime
export const runtime = 'nodejs'

// Función auxiliar para detectar Edge Runtime
export const isEdgeRuntime = () => {
  return process.env.NEXT_RUNTIME === 'edge'
}
