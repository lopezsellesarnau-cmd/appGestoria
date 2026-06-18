# Plan — Módulo Proveedores

> Extraído del plan general de Fase 1 (Núcleo Contable).

## Tarea 1: Conectar tabla de proveedores con su mayor

**Archivos:**
- `components/proveedores/provider-table.tsx` (modificar)

**Cambios:**
- Hacer que el nombre del proveedor sea un `Link` a `/proveedores/[id]/mayor`
- Revisar que el resto de columnas siga funcionando

**Criterio de aceptación:**
- Click en el nombre de cualquier proveedor va a su mayor
- El resto de la tabla no se ve afectado

## Tarea 2: Crear página de mayor de proveedor

**Archivos:**
- `app/proveedores/[id]/mayor/page.tsx` (revisar/crear)
- `components/proveedores/provider-ledger.tsx` (revisar)
- `components/proveedores/provider-filters.tsx` (revisar)

**Cambios:**
- Verificar que la página `/proveedores/[id]/mayor` ya existe o crearla si falta
- Comprobar que muestra: cabecera con datos del proveedor, filtros (fechas, categoría, estado), tabla de gastos

## Tarea 3: Filtros en el mayor de proveedor

**Archivos:**
- `components/proveedores/provider-ledger.tsx` (modificar si es necesario)

**Cambios:**
- Añadir filtros por fecha desde/hasta, categoría, estado, comunidad
- Reutilizar `filterExpenses` de `lib/proveedores/filter-logic.js`
