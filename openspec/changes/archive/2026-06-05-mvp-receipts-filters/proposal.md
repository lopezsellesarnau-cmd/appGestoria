# Proposal: MVP Receipts + Filters

## Intent

Solve the #2 confirmed user pain: "insufficient filter options, incomplete/basic listings." Receipts (ordinary + extraordinary) are the core transactional data in community property management. Building receipts-first validates whether fast filtering + dense tables can beat the current software's UX, using mock data with no backend dependency.

## Scope

### In Scope
- `/recibos` page: filterable receipts table (ordinary + extraordinary) with type, community, owner, date range, and status filters
- `/propietarios/[id]/mayor` page: per-owner consolidated receipt ledger
- Mock data files: receipts (30–50 rows), owners (10–15), communities (3–5), provider references
- Domain types: `types/recibos.ts`, `types/propietarios.ts`, `types/comunidades.ts`
- Navigation update: `Recibos` sidebar link → `/recibos`

### Out of Scope
- Balance calculations, pending totals, financial math
- CSV export (beyond view copy-paste)
- Debtor tracking, provider ledger, cross-community comparisons
- Norma 43/19, Modelo 347, emails, auth, real backend
- Owner/community CRUD beyond minimal mock references

## Capabilities

> Contract between proposal and sdd-spec. Each New Capability becomes an `openspec/specs/<name>/spec.md`.

### New Capabilities
- `receipts-list`: Filterable receipts table with dense tabular display, multi-filter support (type, community, owner, date range, status), and per-row drill-down to owner ledger
- `owner-ledger`: Per-owner consolidated receipt view showing all receipts (ordinary + extraordinary) for a single owner, with summary context (community, date range)

### Modified Capabilities
None — no existing specs in `openspec/specs/`.

## Approach

**Hybrid single-page + drill-down** (Approach 3 from exploration). One `/recibos` page with visible filters above a dense table. An owner name link navigates to `/propietarios/[id]/mayor` for the consolidated ledger view. All data lives in `data/` files, consumed via simple imports (no fetch simulation). CSS Modules with existing design tokens from `components/layout/`. No component library — pure CSS Modules.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `app/recibos/page.tsx` | New | Receipts list route |
| `app/propietarios/[id]/mayor/page.tsx` | New | Owner ledger route |
| `components/recibos/` | New | ReceiptTable, ReceiptFilters, OwnerLedger |
| `data/recibos.ts` | New | Mock receipts (30–50 rows) |
| `data/propietarios.ts` | New | Mock owners (10–15) |
| `data/comunidades.ts` | New | Mock communities (3–5) |
| `types/recibos.ts` | New | Receipt domain types |
| `types/propietarios.ts` | New | Owner domain types |
| `types/comunidades.ts` | New | Community domain types |
| `data/navigation.ts` | Modified | `Recibos` href: `#` → `/recibos` |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Receipt data model wrong | Medium | Treat as tentative — validate with user demo, no backend lock-in |
| No user validation before building | High | Build fast, demo early; scope is mock-only, throwaway-safe |
| Dense tables clash with design tokens | Low | Extend CSS custom properties if needed |
| Owner ledger needs richer data than receipts page | Low | Derive ledger from same `data/` files via simple array ops |

## Rollback Plan

Delete `app/recibos/`, `app/propietarios/[id]/`, `components/recibos/`, `data/recibos.ts`, `data/propietarios.ts`, `data/comunidades.ts`, `types/recibos.ts`, `types/propietarios.ts`, `types/comunidades.ts`. Revert `data/navigation.ts` `href` back to `#`.

## Dependencies

None. No external packages, no backend, no auth.

## Success Criteria

- [ ] `/recibos` renders a filterable table with 30+ mock receipts
- [ ] Type, community, owner, date range, and status filters work independently and combined
- [ ] Clicking an owner navigates to a working `/propietarios/[id]/mayor` page
- [ ] Owner ledger shows all receipts for that owner with community/date context
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] Manual browser verification: dense layout matches DESIGN.md direction
