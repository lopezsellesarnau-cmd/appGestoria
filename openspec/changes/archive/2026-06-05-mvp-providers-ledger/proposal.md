# Proposal: MVP Providers Ledger

## Intent

Solve the #3 user discovery need: quick provider expense consultation. The user needs to filter expenses by community, provider, date, and category, then drill down to per-provider history — oriented toward eventual Modelo 347 consultation. Builds on the validated receipts-list pattern with mock-only data.

## Scope

### In Scope
- `/proveedores` page: filterable expenses table with community, provider, date range, category, and status filters
- `/proveedores/[id]/mayor` page: per-provider consolidated expense ledger
- Mock data: providers (10–15), expenses (30–50 rows) in `data/proveedores.ts`
- Domain types: `types/proveedores.ts` (Provider, Expense)
- Navigation: `Proveedores` sidebar link `#` → `/proveedores`

### Out of Scope
- Balance calculations, running totals, pending amounts
- Modelo 347 threshold logic, tax-year grouping, or VAT breakdown
- Real CIF/NIF validation
- Expense → owner charge allocation
- CSV export, Norma 43/19, auth, real backend, provider CRUD

## Capabilities

### New Capabilities
- `provider-expenses-list`: Filterable expenses table with dense tabular display, multi-filter support (community, provider, date range, category, status), and per-row drill-down to provider ledger
- `provider-ledger`: Per-provider consolidated expense view showing all expenses for a single provider, with summary context (business name, community, date range). Read-only consultation, no financial math.

### Modified Capabilities
None — existing `receipts-list` and `owner-ledger` specs remain unchanged.

## Approach

Parallel the existing receipts-list architecture: thin server page → `'use client'` workspace → filter state + derived filtered data → dense table. Simple expense model (`Provider { id, businessName, taxId, communityId, isActive }`, `Expense { id, providerId, communityId, issueDate, dueDate, concept, amountCents, paymentStatus, category, invoiceNumber? }`) keeps the prototype throwaway-safe with no implied tax rules. CSS Modules reuse global design tokens; components mirror `components/recibos/` structure under `components/proveedores/`. Separate `expense-status-chip` keeps domain boundaries clean — no coupling with receipt status chips.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `types/proveedores.ts` | New | Provider + Expense domain types |
| `data/proveedores.ts` | New | Mock providers (10–15) and expenses (30–50) |
| `components/proveedores/` | New | Provider workspace, filters, table, ledger, status chip |
| `app/proveedores/page.tsx` | New | Expenses list route (thin server page) |
| `app/proveedores/[id]/mayor/page.tsx` | New | Provider ledger route |
| `data/navigation.ts` | Modified | `Proveedores` href: `#` → `/proveedores` |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Expense data model wrong | Medium | Keep model simple — throwaway-safe, no backend lock-in |
| User demo still pending | High | Build fast and cheap; mock-only discovery territory |
| Category field may imply validated chart of accounts | Medium | Document in spec that categories are mock labels, not validated |
| ~1100–1300 lines exceeds review budget (400) | Medium | Split review into design+apply phases; budget is a soft cap |

## Rollback Plan

Delete `app/proveedores/`, `components/proveedores/`, `data/proveedores.ts`, `types/proveedores.ts`. Revert `data/navigation.ts` `href` back to `#`.

## Dependencies

None. No external packages, no backend, no auth. Reuses existing `data/comunidades.ts` for community references in mock expenses.

## Success Criteria

- [ ] `/proveedores` renders a filterable table with 30+ mock expenses
- [ ] Community, provider, category, date range, and status filters work independently and combined
- [ ] Clicking a provider navigates to a working `/proveedores/[id]/mayor` page
- [ ] Provider ledger shows all expenses for that provider with community/date context
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] Manual browser verification: layout matches existing receipts-list pattern
