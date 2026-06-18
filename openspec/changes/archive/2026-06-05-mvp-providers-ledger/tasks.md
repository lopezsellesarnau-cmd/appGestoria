# Tasks: MVP Providers Ledger

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~850–900 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | 3 chained PRs (Foundation → Workspace/Filters → Table/Ledger) |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Foundation: types, mock data, nav link | PR 1 | Base types + 30-50 mock expenses; minimal diff |
| 2 | Workspace + Filters + List page | PR 2 | Client workspace, filter controls, thin server page |
| 3 | Table, Ledger, Status chip + Ledger page | PR 3 | Dense table, per-provider ledger, status chip |

## Phase 1: Foundation

- [x] 1.1 Create `types/proveedores.ts` with `Provider`, `ProviderExpense`, `ProviderExpenseStatus`, `ProviderExpenseCategory` interfaces matching design contracts
- [x] 1.2 Create `data/proveedores.ts` exporting `PROVEEDORES` (10–15 providers) and `GASTOS` (30–50 expenses) referencing existing `COMUNIDADES` ids
- [x] 1.3 Modify `data/navigation.ts`: change `Proveedores` href from `"#"` to `"/proveedores"`

## Phase 2: Expenses List Page

- [x] 2.1 Create `components/proveedores/provider-filters.tsx` with `ProviderFiltersProps` interface; expose visible filters for community, provider, date range, category, payment status (mirrors `receipt-filters.tsx` pattern)
- [x] 2.2 Create `components/proveedores/provider-filters.module.css` with filter layout styles using existing design tokens
- [x] 2.3 Create `components/proveedores/provider-workspace.tsx` as `'use client'` component: owns filter state, builds `providerNameMap` and `communityNameMap` with `useMemo`, derives `filteredGastos` (mirrors `receipt-workspace.tsx` pattern)
- [x] 2.4 Create `components/proveedores/provider-workspace.module.css`
- [x] 2.5 Create `app/proveedores/page.tsx` as thin async server page passing `PROVEEDORES`, `GASTOS`, `COMUNIDADES` to `ProviderWorkspace`

## Phase 3: Table, Ledger, and Status Chip

- [x] 3.1 Create `components/proveedores/expense-status-chip.tsx` with `ExpenseStatusChip` component for `paid | pending | overdue` labels/colors (separate from receipt `StatusChip`)
- [x] 3.2 Create `components/proveedores/expense-status-chip.module.css`
- [x] 3.3 Create `components/proveedores/provider-table.tsx` with `ProviderTableProps`; dense table with provider column linking to `/proveedores/[id]/mayor`, empty state when no rows match
- [x] 3.4 Create `components/proveedores/provider-table.module.css`
- [x] 3.5 Create `components/proveedores/provider-ledger.tsx` with `ProviderLedgerProps`; shows provider context header, back link, expense history table, no-expenses state (mirrors `owner-ledger.tsx` pattern)
- [x] 3.6 Create `components/proveedores/provider-ledger.module.css`
- [x] 3.7 Create `app/proveedores/[id]/mayor/page.tsx` as async server page following existing `owner-ledger` route pattern: resolve `id` from `params`, call `notFound()` for unknown providers, filter `GASTOS` by `providerId`

## Phase 4: Verification

- [x] 4.1 Run `npx tsc --noEmit` — must pass with zero errors
- [x] 4.2 Run `npm run lint` if available
- [x] 4.3 Verified via executable tests: filter AND semantics proven, empty filtered state reachable, provider drill-down links valid (see `tests/proveedores/filter-logic.test.mjs`)
- [x] 4.4 Verified via HTTP runtime tests: invalid provider id returns `notFound()` (see `verify-report.md`)

## Phase 5: Documentation (if needed)

- [x] 5.1 Confirm no new docs required — prototype-only slice with no user-facing behavior changes beyond new routes
