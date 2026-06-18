# Proposal: Modelo 347 — Declaración Anual de Operaciones con Terceros

## Intent

Provide a dedicated annual report that consolidates provider expenses across all communities by CIF/NIF, applies the 3.001 € threshold, and supports CSV export — matching Fase 2 (Fiscalidad y reporting) from the MVP document.

## Scope

### In Scope
- New route `/informes/modelo-347` with fiscal year selector
- Table grouped by CIF: business name, total annual amount, invoice count, communities served
- Consolidation of per-community `Provider` records into `taxId`-grouped annual summaries at query time
- CSV export reusing `lib/csv/export.js`
- Only rows exceeding 3.001 € for the selected fiscal year are displayed

### Out of Scope
- IVA logic (with/without toggle, rate handling) — requires domain validation with the user
- Backend API or database queries — mock data only
- Auth, permissions, or multi-tenant isolation
- Modifications to existing `/proveedores` or `/proveedores/[id]/mayor` routes

## Capabilities

### New Capabilities
- `modelo-347-report`: dedicated annual fiscal report page at `/informes/modelo-347` that consolidates provider expenses by CIF across all communities, applies the 3.001 € threshold per fiscal year, and supports CSV export

### Modified Capabilities
None — existing `provider-expenses-list` and `provider-ledger` specs are unchanged.

## Approach

New `filterModelo347(expenses, providers, year)` pure function in `lib/proveedores/`:
1. Join `ProviderExpense[]` → `Provider` via `providerId`
2. Group by `taxId` (CIF), summing `amountCents` per fiscal year
3. Filter to rows where total > 300.100 cents (3.001 €)
4. Return `AnnualProviderSummary[]` with businessName, invoiceCount, and communityIds

Dedicated route `/informes/modelo-347` with year `<select>` (default: current, range: 2023–next year), aggregated table, and CSV export button. Mock data must include multi-community CIF records and threshold-crossing cases.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `lib/proveedores/filter-logic.js` | New | `filterModelo347` pure function |
| `types/proveedores.ts` | New | `AnnualProviderSummary` type |
| `app/(routes)/informes/modelo-347/` | New | Route with page, layout |
| `components/informes/modelo-347/` | New | Table, year selector, export button |
| `data/proveedores.ts` | Modified | Add multi-community CIF records for testing |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Multi-community CIF consolidation at query time proves fragile | Low | Pure function, unit-testable; mock data validates edge cases |
| 3.001 € threshold interpretation differs from real IRS rules | Low | Threshold is a configurable constant; adjustable without structural changes |
| User expects IVA toggle day one | Med | Explicitly scoped out; separate change when validated |

## Rollback Plan

Delete `app/(routes)/informes/modelo-347/` and `components/informes/modelo-347/`. Remove `filterModelo347` export from filter-logic. No existing routes or specs are modified.

## Dependencies

- Existing `providerExpenses` and `providers` mock datasets in `data/proveedores.ts`
- Existing CSV export utility in `lib/csv/export.js`

## Success Criteria

- [ ] `/informes/modelo-347` renders an aggregated table filtered by fiscal year
- [ ] Providers below 3.001 € threshold are hidden
- [ ] CSV export downloads correct rows matching the visible table
- [ ] Multi-community CIF consolidation produces single row with correct totals
