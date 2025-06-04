# POP & Cooler Dashboard - Nuevas Gráficas

Este documento describe las nuevas gráficas agregadas al dashboard para el análisis de POP (Point of Purchase) y Coolers en puntos de venta.

## 📊 Nuevas Gráficas Implementadas

### Coolers

1. **PDV con/sin Cooler** - Gráfico de dona que muestra la distribución de puntos de venta con y sin cooler
2. **Tipos de Cooler** - Gráfico de barras que muestra los diferentes tipos de cooler (Vertical, Horizontal, Portátil)
3. **Ventas por Cooler** - Comparación de ventas entre PDV con y sin cooler
4. **Imágenes de Coolers** - Galería de imágenes de coolers en puntos de venta

### POP (Point of Purchase)

1. **PDV con/sin POP** - Gráfico de dona que muestra la distribución de puntos de venta con y sin material POP
2. **Tipos de POP** - Gráfico de barras que muestra los diferentes tipos de material POP (Cintillo, Dangler, Preciador, Banner)
3. **Imágenes de POP** - Galería de imágenes de material POP en puntos de venta

## 📁 Archivos Modificados/Creados

### Página Principal

- `app/[client]/demos/page.tsx` - Página donde se integran todas las nuevas gráficas

### Componentes de Cooler

- `components/sampling/pdv-cooler-chart.tsx` - Gráfico de dona PDV con/sin cooler
- `components/sampling/cooler-types-chart.tsx` - Gráfico de barras tipos de cooler
- `components/sampling/cooler-sales-chart.tsx` - Gráfico de barras ventas por cooler
- `components/sampling/cooler-images.tsx` - Galería de imágenes de coolers

### Componentes de POP

- `components/sampling/pdv-pop-chart.tsx` - Gráfico de dona PDV con/sin POP
- `components/sampling/pop-types-chart.tsx` - Gráfico de barras tipos de POP
- `components/sampling/pop-images.tsx` - Galería de imágenes de POP

### Tipos y Interfaces

- `components/sampling/sampling.types.ts` - Tipos TypeScript para los nuevos componentes

## 🎨 Características de Diseño

### Gráficos de Dona (PDV con/sin Cooler y POP)

- Colores personalizados para diferenciación visual
- Tooltips informativos con porcentajes
- Leyenda integrada
- Responsive design

### Gráficos de Barras (Tipos)

- Ordenamiento automático de mayor a menor cantidad
- Labels centrados dentro de las barras (texto blanco para mejor visibilidad)
- Tooltips con información detallada
- Bordes redondeados en las barras

### Gráficos de Ventas

- Formato de moneda en tooltips
- Comparación visual clara entre categorías
- Colores diferenciados

### Galerías de Imágenes

- Grid responsive
- Overlay con nombres descriptivos
- Hover effects
- Optimización para impresión

## 🔧 Modificaciones Recientes

### Cooler Types Chart

- **Cambio**: Movimiento de labels de arriba de las barras al centro
- **Archivo**: `components/sampling/cooler-types-chart.tsx`
- **Líneas modificadas**:
  - `position="top"` → `position="center"`
  - Agregado `fill="white"` para mejor visibilidad

## 📱 Responsive Design

Todas las gráficas están optimizadas para:

- **Mobile**: 1 columna
- **Tablet**: 2 columnas
- **Desktop**: 3 columnas
- **Print**: Layout específico para impresión

## 🚀 Datos de Ejemplo

Actualmente todas las gráficas utilizan datos de ejemplo (mock data) definidos directamente en `demos/page.tsx`. Para implementación en producción, estos datos deberán ser reemplazados por:

1. Llamadas a APIs específicas
2. Funciones de utilidad en `lib/utils/dashboard-data/`
3. Integración con la base de datos Prisma

## 📝 Notas para Desarrollo Futuro

1. **Integración de Datos Reales**: Reemplazar mock data con datos reales de la base de datos
2. **Filtros**: Implementar filtros por fecha, región, etc.
3. **Exportación**: Agregar funcionalidad de exportación de gráficas
4. **Animaciones**: Considerar agregar animaciones de entrada para mejor UX

## 🔍 Ubicación en el Dashboard

Las nuevas gráficas se encuentran en la sección **"Demos"** del dashboard, accesible desde:

```
/[client]/demos
```

---

_Documento creado para facilitar el mantenimiento y futuras modificaciones del sistema de gráficas POP y Cooler._
