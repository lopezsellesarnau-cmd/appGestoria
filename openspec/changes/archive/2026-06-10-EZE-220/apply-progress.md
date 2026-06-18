# Apply Progress — EZE-220

**Change**: EZE-220 — Bloque 3 — Vista de Deudores
**Mode**: Standard (strict_tdd: false)
**Date**: 2026-06-10

## Completed Tasks

### 3.1 — Componente principal de deudores
- [x] Crear `app/deudores/page.tsx`
- [x] Crear `components/deudores/debtor-workspace.tsx`
- [x] Crear `components/deudores/debtor-table.tsx`
- [x] Crear `components/deudores/debtor-filters.tsx`
- [x] Columnas: Propietario, Comunidad, Unidad, Deuda total, Deuda judicial (rojo), nº Recibos, Antigüedad
- [x] Filtros: por comunidad, por tipo (con/sin judicial)
- [x] Cada fila link al mayor del propietario

### 3.2 — Pure function para calcular deuda
- [x] Crear `lib/propietarios/debt-logic.js`
- [x] Función `calculateOwnerDebt(receipts) → { totalPending, totalJudicial, oldestPendingDays, count }`
- [x] Manejar caso de propietario sin recibos pendientes (devuelve ceros)

### 3.3 — Botón exportar CSV en deudores
- [x] Añadir botón "Exportar CSV" en `debtor-workspace`
- [x] Genera CSV con los deudores filtrados
- [x] Crear `lib/csv/export.js` (reutilizable)

## Files Changed

| File | Action | What Was Done |
|------|--------|---------------|
| `lib/propietarios/debt-logic.js` | Created | Pure function `calculateOwnerDebt()` for debt summary |
| `lib/csv/export.js` | Created | `generateCSV()` and `downloadCSV()` utilities |
| `components/deudores/debtor-filters.tsx` | Created | Filter controls with community/type dropdowns + export button |
| `components/deudores/debtor-filters.module.css` | Created | Filter styles matching project patterns |
| `components/deudores/debtor-table.tsx` | Created | Table with judicial debt highlighted in red, owner links to mayor |
| `components/deudores/debtor-table.module.css` | Created | Table styles, red for judicial, antiquity color coding |
| `components/deudores/debtor-workspace.tsx` | Created | Main orchestrator: computes debtors from receipts, filters, export |
| `components/deudores/debtor-workspace.module.css` | Created | Workspace layout |
| `app/deudores/page.tsx` | Created | Page component wiring data sources |

## Verification

- `npm run lint`: ✅ No ESLint warnings or errors
- `npm run build`: ✅ Build successful, `/deudores` route included
- `npx tsc --noEmit`: ✅ No TypeScript errors

## Deviations from Design

None — implementation matches design.

## Issues Found

None.

### EZE-220 Fix — Filtro "Sin deuda judicial"
- [x] Added `"no-judicial"` to `DebtorFilterType`
- [x] Added "Sin deuda judicial" option to filter select
- [x] Updated filter logic in `debtor-workspace.tsx` to exclude owners with `totalJudicial > 0` when `"no-judicial"` is selected

## Files Changed (EZE-220 Fix)

| File | Action | What Was Done |
|------|--------|---------------|
| `components/deudores/debtor-filters.tsx` | Updated | Added `"no-judicial"` type and third filter option |
| `components/deudores/debtor-workspace.tsx` | Updated | Added `no-judicial` filter branch: excludes owners with judicial debt > 0 |

## Debt computation notes

Mock deudores (≥1 non-paid receipt): prop-003, prop-005, prop-007, prop-008, prop-011, prop-013, prop-014, prop-015
- Judicial: prop-003 (rec-007: 60000c), prop-007 (rec-020: 19500c), prop-015 (rec-032: 14000c)
