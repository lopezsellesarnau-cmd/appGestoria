# Apply Progress: Comunidades Navigation

## Status: ✅ COMPLETED

## Tasks Completed

### Task 1: Página índice de Propietarios ✅
- **File**: `app/propietarios/page.tsx` (new)
- **CSS Module**: `app/propietarios/propietarios.module.css` (new)
- Table columns: Nombre, Unidad, Comunidad, Nº Recibos pendientes, Deuda total
- Deuda = sum of receipt amounts where status is NOT paid (pending + claimed + judicial)
- Each row links to `/propietarios/[id]/mayor`

### Task 2: Página detalle de Comunidad ✅
- **File**: `app/comunidades/[id]/page.tsx` (new)
- **CSS Module**: `app/comunidades/[id]/community-detail.module.css` (new)
- Shows: community name, municipality, owner list with pending receipts count and debt per owner
- Total pending receipts and debt aggregated at the top

### Task 3: Página índice de Comunidades ✅
- **File**: `app/comunidades/page.tsx` (new)
- **CSS Module**: `app/comunidades/comunidades.module.css` (new)
- Table columns: Nombre, Municipio, Nº Propietarios, Nº Recibos pendientes
- Each row links to `/comunidades/[id]`
- Counts owners and pending receipts per community

### Task 4: Arreglar sidebar con rutas reales ✅
- **File**: `data/navigation.ts` (modified)
- Comunidades → `/comunidades`
- Propietarios → `/propietarios`
- Deudores → `/deudores` (new route added)
- Recibos → `/recibos` (unchanged)
- Proveedores → `/proveedores` (unchanged)
- Dashboard → `/` (unchanged)
- Removed: Bancos, Liquidaciones, Comunicaciones, Informes, Configuración

## Verification

```bash
npm run lint  # ✅ No ESLint warnings or errors
npm run build # ✅ Build successful
```

## Files Changed

- `app/propietarios/page.tsx` (new)
- `app/propietarios/propietarios.module.css` (new)
- `app/comunidades/page.tsx` (new)
- `app/comunidades/comunidades.module.css` (new)
- `app/comunidades/[id]/page.tsx` (new)
- `app/comunidades/[id]/community-detail.module.css` (new)
- `data/navigation.ts` (modified)

## Notes

- All pages are Server Components (no "use client" directive needed)
- CSS Modules only, following existing patterns
- Mock data stays in `data/` directory
- Build output shows proper static/dynamic route classification
