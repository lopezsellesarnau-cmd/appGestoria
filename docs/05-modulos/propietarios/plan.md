# Plan — Módulo Propietarios

> Extraído del plan general de Fase 1 (Núcleo Contable).

## Tarea 1: Página índice de Propietarios

**Archivos:**
- `app/propietarios/page.tsx` (crear)
- `components/propietarios/owner-table.tsx` (crear)
- `components/propietarios/owner-table.module.css` (crear)

**Cambios:**
- Listar todos los propietarios mock (16 actualmente)
- Columnas: Nombre, Unidad, Comunidad, nº Recibos pendientes, Deuda total
- Cada fila es link a `/propietarios/[id]/mayor`

**Criterio de aceptación:**
- La página `/propietarios` muestra los 16 propietarios
- La deuda total suma correctamente los recibos no pagados (`pending`, `claimed`, `judicial`)
- Click en cualquier propietario va al mayor

## Tarea 2: Pure function para calcular deuda

**Archivos:**
- `lib/propietarios/debt-logic.js` (crear)
- `tests/debt-logic.test.js` (opcional)

**Cambios:**
- Función pura `calculateOwnerDebt(receipts)` que devuelve `{ totalPending, totalJudicial, oldestPendingDays, count }`
- Usada tanto en deudores como en la tabla de propietarios

**Criterio de aceptación:**
- La función maneja correctamente el caso de propietario sin recibos pendientes (devuelve ceros)
