# Plan — Módulo Recibos / Mayor de Propietario

> Extraído del plan general de Fase 1 (Núcleo Contable).

## Tarea 1: Extender el tipo de filtro de mayor

**Archivos:**
- `components/recibos/owner-ledger.tsx` (modificar)

**Cambios:**
- Convertir `OwnerLedger` en componente cliente con estado
- Añadir tipo `LedgerViewMode = "combined" | "ordinary" | "extraordinary"`
- Estado inicial: `"combined"`
- Tres botones o un `select` con las tres opciones

**Criterio de aceptación:**
- El mayor muestra los tres modos seleccionables
- Por defecto muestra todos los recibos (combinado)

## Tarea 2: Filtrar recibos por modo

**Archivos:**
- `components/recibos/owner-ledger.tsx` (modificar)

**Cambios:**
- `useMemo` que filtra `receipts` por `type === viewMode` o los muestra todos si `combined`
- Mantener el orden cronológico actual

**Criterio de aceptación:**
- Modo "Ordinario" muestra solo recibos `type === "ordinary"`
- Modo "Extraordinario" muestra solo recibos `type === "extraordinary"`
- Modo "Combinado" muestra todos

## Tarea 3: Totales por modo

**Archivos:**
- `components/recibos/owner-ledger.tsx` (modificar)
- `components/recibos/owner-ledger.module.css` (modificar)

**Cambios:**
- Añadir bloque de totales visible encima de la tabla
- Mostrar: Total emitido, Total pagado, Total pendiente (suma de `pending` + `claimed` + `judicial`)
- Actualizar los totales al cambiar de modo

## Tarea 4: Highlight de deuda judicializada

**Archivos:**
- `components/recibos/owner-ledger.tsx` (modificar)

**Cambios:**
- Aplicar clase CSS con color de fondo distinto a filas con `status === "judicial"`
- Color sugerido: rojo claro de fondo, texto en negrita
