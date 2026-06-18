# Plan — Módulo Informes / Deudores

> Extraído del plan general de Fase 1 (Núcleo Contable).

## Tarea 1: Componente principal de deudores

**Archivos:**
- `app/deudores/page.tsx` (crear)
- `components/deudores/debtor-workspace.tsx` (crear)
- `components/deudores/debtor-workspace.module.css` (crear)
- `components/deudores/debtor-table.tsx` (crear)
- `components/deudores/debtor-table.module.css` (crear)
- `components/deudores/debtor-filters.tsx` (crear, opcional)
- `components/deudores/debtor-filters.module.css` (crear)

**Cambios:**
- Listar todos los propietarios que tengan al menos un recibo no pagado
- Columnas: Propietario, Comunidad, Unidad, Deuda total, Deuda judicial (destacada en rojo), nº Recibos pendientes, Antigüedad
- Fila es link al mayor del propietario
- Filtros: por comunidad, por tipo (con/sin deuda judicial)

**Criterio de aceptación:**
- La tabla cuadra con los datos mock
- La columna "Deuda judicial" suma solo los recibos con `status === "judicial"`
- El color de la columna judicial es visiblemente distinto

## Tarea 2: Exportación CSV

**Archivos:**
- `lib/csv/export.js` (crear)
- `components/deudores/debtor-workspace.tsx` (modificar — botón exportar)
- `components/recibos/receipt-workspace.tsx` (modificar — botón exportar)

**Cambios:**
- Función `toCSV(rows, columns)` que genera string CSV con cabeceras
- Maneja correctamente comas, comillas y saltos de línea
- Descarga directa en navegador (Blob + link)
- Botón "Exportar CSV" en deudores y recibos

**Criterio de aceptación:**
- La función maneja valores con caracteres especiales
- El botón genera un CSV descargable con los datos visibles en pantalla
