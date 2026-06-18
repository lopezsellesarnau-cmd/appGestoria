# Plan — Sidebar / Navegación General

> Extraído del plan general de Fase 1 (Núcleo Contable). Afecta a todos los módulos.

## Tarea: Arreglar sidebar con rutas reales

**Archivos:**
- `data/navigation.ts` (modificar)

**Cambios:**
- Reemplazar los `href: "#"` por rutas reales:
  - `Dashboard` → `/`
  - `Comunidades` → `/comunidades`
  - `Propietarios` → `/propietarios`
  - `Recibos` → `/recibos`
  - `Proveedores` → `/proveedores`
  - `Deudores` → `/deudores` (nuevo)
- Eliminar entradas que no tengan ruta todavía: `Bancos`, `Liquidaciones`, `Comunicaciones`, `Informes`, `Configuración`

**Criterio de aceptación:**
- El sidebar muestra solo entradas con rutas válidas
- Click en cada una navega sin error 404
