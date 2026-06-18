# EZE-220 — Tasks

## 3.1 — Componente principal de deudores

- [x] Crear `app/deudores/page.tsx`
- [x] Crear `components/deudores/debtor-workspace.tsx`
- [x] Crear `components/deudores/debtor-table.tsx`
- [x] Crear `components/deudores/debtor-filters.tsx`
- [x] Columnas: Propietario, Comunidad, Unidad, Deuda total, Deuda judicial (rojo), nº Recibos, Antigüedad
- [x] Filtros: por comunidad, por tipo (con/sin judicial)
- [x] Cada fila link al mayor del propietario

## 3.2 — Pure function para calcular deuda

- [x] Crear `lib/propietarios/debt-logic.js`
- [x] Función `calculateOwnerDebt(receipts) → { totalPending, totalJudicial, oldestPendingDays, count }`
- [x] Manejar caso de propietario sin recibos pendientes (devuelve ceros)

## 3.3 — Botón exportar CSV en deudores

- [x] Añadir botón "Exportar CSV" en `debtor-workspace`
- [x] Genera CSV con los deudores filtrados
- [x] Crear `lib/csv/export.js` (reutilizable por otros módulos)
