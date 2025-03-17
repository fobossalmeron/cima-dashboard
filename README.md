NUEVO REPORTE DEMOS - EDT BEBIDAS

# Cima Dashboard

## Arquitectura de Servicios

### Estructura de Carpetas

```
/services
  /dashboard
    - dashboard.service.ts
    - dashboard-sync.service.ts
  /repsly
    - repsly.service.ts
    - repsly-auth.service.ts
  /products
    - product.service.ts
    - product-metrics.service.ts
  /forms
    - form.service.ts
    - form-template.service.ts

/controllers
  /dashboard
    - dashboard.controller.ts
    - dashboard-sync.controller.ts
  /repsly
    - repsly.controller.ts
  /products
    - product.controller.ts
  /forms
    - form.controller.ts

/app/api
  /dashboard
    /route.ts
    /sync/route.ts
  /repsly
    /route.ts
    /auth/route.ts
  /products
    /route.ts
  /forms
    /route.ts
```

### Principios y Convenciones

1. **Organización por Contexto**

   - Los servicios se organizan por dominio o contexto de negocio
   - Servicios relacionados con el mismo modelo o lógica se agrupan en la misma carpeta
   - Cada servicio tiene una responsabilidad única y clara

2. **Servicios de Terceros**

   - Los servicios que interactúan con APIs externas tienen su propia carpeta
   - Se separan las responsabilidades de autenticación y operaciones
   - Ejemplo: `/services/repsly` para todos los servicios relacionados con Repsly

3. **Controllers**

   - Actúan como intermediarios entre los endpoints y los servicios
   - Manejan la validación de datos y la transformación de respuestas
   - No contienen lógica de negocio

4. **Endpoints**

   - Ubicados en `/app/api`
   - Cada endpoint corresponde a una función pública de un servicio
   - Manejan la comunicación HTTP y la serialización/deserialización

5. **Flujo de Datos**
   ```
   Frontend -> Controller -> Service -> Database/External API
   ```

### Ejemplo de Implementación

```typescript
// /services/repsly/repsly.service.ts
export class RepslyService {
  static async exportForm(id: string): Promise<string> {
    // Lógica de negocio
  }
}

// /controllers/repsly/repsly.controller.ts
export class RepslyController {
  static async exportForm(id: string): Promise<ApiResponse> {
    try {
      const data = await RepslyService.exportForm(id)
      return { success: true, data }
    } catch (error) {
      return { success: false, error }
    }
  }
}

// /app/api/repsly/forms/[id]/export/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  return RepslyController.exportForm(params.id)
}
```

### Beneficios

1. **Separación de Responsabilidades**

   - Cada capa tiene una responsabilidad clara
   - Facilita el testing y mantenimiento
   - Mejora la reutilización de código

2. **Seguridad**

   - Los servicios nunca son accedidos directamente desde el frontend
   - Validación y sanitización de datos en cada capa
   - Manejo centralizado de autenticación

3. **Mantenibilidad**

   - Estructura clara y predecible
   - Fácil de extender y modificar
   - Mejor organización del código

4. **Escalabilidad**
   - Fácil de agregar nuevos servicios
   - Posibilidad de reutilizar lógica entre servicios
   - Mejor manejo de dependencias
