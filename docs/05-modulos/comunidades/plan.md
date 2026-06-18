# Plan — Módulo Comunidades

> Extraído del plan general de Fase 1 (Núcleo Contable).

## Tarea: Página índice de Comunidades

**Archivos:**
- `app/comunidades/page.tsx` (crear)
- `app/comunidades/[id]/page.tsx` (crear, detalle básico)
- `components/comunidades/community-table.tsx` (crear)
- `components/comunidades/community-table.module.css` (crear)
- `components/comunidades/community-detail.tsx` (crear, opcional)

**Cambios:**
- Listar las 4 comunidades mock con columnas: Nombre, Municipio, nº Propietarios, nº Recibos pendientes
- Cada fila es un link a `/comunidades/[id]`
- Detalle: nombre, municipio, lista de propietarios y total de recibos pendientes

**Criterio de aceptación:**
- La página `/comunidades` muestra las 4 comunidades
- Click en una comunidad abre su detalle
- El detalle muestra al menos un propietario y los recibos

**Verificación:**
- `npm run dev` → ir a `/comunidades` y revisar
