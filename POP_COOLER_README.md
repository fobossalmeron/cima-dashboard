# POP & Cooler Dashboard - Nuevas Gráficas

Este documento describe las nuevas gráficas agregadas al dashboard para el análisis de POP (Point of Purchase) y Coolers en puntos de venta.

## 📊 Nuevas Gráficas Implementadas

### Coolers

1. **PDV con/sin Cooler** - Gráfico de dona que muestra la distribución de puntos de venta con y sin cooler.
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

## Falta mobile
