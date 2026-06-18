# Proposal: CSV Export for Comunidades and Propietarios

## Intent

Users need to export filtered Comunidades and Propietarios list data to CSV for reporting and offline use. The recibos and deudores views already support this; comunidades and propietarios do not.

## Scope

### In Scope
- Add "Exportar CSV" button to `/comunidades` filter bar (right-aligned)
- Add "Exportar CSV" button to `/propietarios` filter bar (right-aligned)
- CSV exports respect active search/filter state (same pattern as recibos/deudores)
- Comunidades columns: Nombre, Municipio, Nº Propietarios, Recibos pendientes, Estado
- Propietarios columns: Nombre, Unidad, Comunidad, Recibos pendientes, Deuda total (€)
- Reuse `lib/csv/export.js` (`generateCSV`, `downloadCSV`) without changes

### Out of Scope
- Extracting workspace/filter components from page.tsx
- New CSV formats beyond list data
- Email/SMS distribution of exports

## Capabilities

### New Capabilities
- `comunidades-csv-export`: CSV export of filtered Comunidades list — inline handler in page.tsx using existing CSV utility
- `propietarios-csv-export`: CSV export of filtered Propietarios list — inline handler in page.tsx, includes computed debt columns (totalDebt, pendingCount)

### Modified Capabilities
None

## Approach

Inline addition to both page.tsx files — no new components. Import `generateCSV`/`downloadCSV` from `@/lib/csv/export`, write `handleExportCSV` inside each page component, add a `<Button>` in the existing filter row after `flex-1` spacer. Matches exact pattern used in `/recibos` and `/deudores`.

Each handler builds Spanish headers, maps column keys, passes filtered data to `generateCSV`, then triggers `downloadCSV` with a timestamped filename.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `app/comunidades/page.tsx` | Modified | Add CSV export handler, import, button in filter row |
| `app/propietarios/page.tsx` | Modified | Add CSV export handler, import, button in filter row |
| `lib/csv/export.js` | None | Reused as-is |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Debt columns differ from table display | Low | Export uses same computed values rendered in table; consistency guaranteed |
| Large datasets bloat CSV | Low | Mock data bounded (~60 owners, ~20 communities); real concern deferred to backend phase |

## Rollback Plan

Revert both page.tsx to pre-change state. No database, no migration, no shared state.

## Dependencies

- `lib/csv/export.js` — already stable (used by recibos, deudores)
- Mock data inline in page.tsx files — already includes computed fields: `pendingCount`, `totalDebt`, `ownerCount`, `communityName`, `hasDebt`, `hasPending`

## Success Criteria

- [ ] "Exportar CSV" button visible in both filter bars, right-aligned, matching existing style
- [ ] Clicking export downloads a UTF-8 BOM CSV with correct Spanish headers
- [ ] Exported rows match currently filtered table rows exactly
- [ ] Propietarios CSV includes computed `totalDebt` (€) and `pendingCount` columns
- [ ] `npx tsc --noEmit` passes after changes
